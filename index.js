require("dotenv").config();
const express = require("express");
const redis = require("redis");
const shortid = require("shortid");

const app = express();
app.use(express.json());

const redisClientsConfig = [
  { host: process.env.REDIS_HOST_1, port: process.env.REDIS_PORT_1 },
  { host: process.env.REDIS_HOST_2, port: process.env.REDIS_PORT_2 },
  { host: process.env.REDIS_HOST_3, port: process.env.REDIS_PORT_3 },
];

const redisClient = redisClientsConfig.map((cfg) => {
  const client = redis.createClient({
    socket: {
      host: cfg.host,
      port: cfg.port ? Number(cfg.port) : undefined,
    },
  });
  client.on("error", (err) => console.error("Redis Client Error", err));
  return client;
});

// connect all redis clients before starting the server
async function start() {
  await Promise.all(
    redisClient.map(async (c, idx) => {
      try {
        await c.connect();
        console.log(`Redis client ${idx} connected`);
      } catch (err) {
        console.error(`Failed to connect Redis client ${idx}:`, err.message);
      }
    })
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Hash function to distribute keys among Redis clients
function getRedisClient(key) {
  const hash = key
    .split("")
    .reduce((acc, char) => acc + char.codePointAt(0), 0);
  const index = hash % redisClient.length;
  return redisClient[index];
}

// Endpoint to shorten a URL
app.post("/shorten", async (req, res) => {
  try {
    const { url, ttl } = req.body; // ttl (time-to-live) is optional
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = shortid.generate();
    const client = getRedisClient(shortId);

    if (!client || !client.isOpen) {
      console.error("Selected Redis client is not available");
      return res.status(503).json({ error: "Storage unavailable" });
    }

    await client.set(shortId, url, { EX: ttl || 3600 }); // Default TTL is 1 hour if not provided

    res.json({ shortUrl: `http://localhost:${process.env.PORT || 3000}/${shortId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to redirect to the original URL
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const client = getRedisClient(shortId);

    if (!client || !client.isOpen) {
      console.error("Selected Redis client is not available");
      return res.status(503).send("Storage unavailable");
    }

    const url = await client.get(shortId);
    if (!url) {
      console.log(`Cache miss for key: ${shortId}`);
      return res.status(404).send("URL not found");
    }
    console.log(`Cache hit for key: ${shortId}`);
    res.json({ OriginalUrl: url });
    // res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

start();

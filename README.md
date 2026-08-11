# 🔗 WebOnFly_URLShortner – Scalable URL Shortener with Redis

A production‑ready **URL Shortener** built with **Node.js**, following clean architecture principles.  
It leverages **Redis** for caching to achieve high performance and scalability.

---

## 📐 Architecture Overview

The solution follows a layered architecture:

- API Server: Handles requests for shortening and retrieving URLs.
- Redis Caching Layer: Uses multiple Redis instances for distributed caching.
- Docker: Simulates a distributed environment with multiple Redis containers.

---

## Setting up the project

- **express**: A lightweight web server framework.
- **redis**: To handle caching.
- **shortid**: For generating short, unique IDs.
- **dotenv**: For managing environment variables.

## ⚡ Redis Caching

Redis is used to cache frequently accessed URLs to reduce database load and improve response times.

### Example: Cache Shortened URL
```javascript
const redis = require('redis');
const client = redis.createClient();

async function getShortUrl(shortCode) {
  const cachedUrl = await client.get(shortCode);
  if (cachedUrl) {
    return cachedUrl; // Return cached value
  }

  const url = await db.findUrl(shortCode); // Query DB
  await client.set(shortCode, url, { EX: 3600 }); // Cache for 1 hour
  return url;
}
```
##🚀 Getting Started
###Prerequisites
- Node.js v18+
- Redis server running locally or in the cloud

## Setup Instructions

```
git clone https://github.com/shashiksingh786/WebOnFly_URLShortner.git
cd WebOnFly_URLShortner
npm install
```

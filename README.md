# 🔗 WebOnFly_URLShortner – Scalable URL Shortener with Redis

A production‑ready **URL Shortener** built with **Node.js**, following clean architecture principles.  
It leverages **Redis** for caching and Pub/Sub communication to achieve high performance and scalability.

---

## 📐 Architecture Overview

The solution follows a layered architecture:

- **Presentation Layer** (`Express API`): Handles HTTP requests and responses.
- **Application Layer**: Contains business logic, use cases, and interfaces.
- **Domain Layer**: Core domain models and business rules.
- **Infrastructure Layer**: Implements external concerns like services and data access.
- **Persistence Layer**: Database implementation (e.g., MongoDB/PostgreSQL).
- **Caching Layer (Redis)**: Provides fast in‑memory caching and Pub/Sub messaging.

---

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

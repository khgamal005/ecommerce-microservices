import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,
  tls: {}, // For Upstash, always use TLS
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  connectTimeout: 10000,
  retryDelay: 100, // Use 'retryDelay' instead of 'retryDelayOnFailover'
});

export default redis;
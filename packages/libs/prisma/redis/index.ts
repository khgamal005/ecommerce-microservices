import Redis from "ioredis";

const redis = new Redis({
  host: 'quick-elf-32578.upstash.io',
  port: 6379,
  password: 'AX9CAAIncDI1YTgzYzk2MTgyOGE0ZmFlODJjNzQyNzU2ZjBiMDYxM3AyMzI1Nzg',
  tls: {}, // Required for Upstash
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  connectTimeout: 10000,
});

export default redis;
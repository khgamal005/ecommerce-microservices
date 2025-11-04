import Redis from "ioredis";

const redis = new Redis({
  host: 'quick-elf-32578.upstash.io',
  port: 6379,
  password: 'AX9CAAIncDI1YTgzYzk2MTgyOGE0ZmFlODJjNzQyNzU2ZjBiMDYxM3AyMzI1Nzg',
  tls: {
    rejectUnauthorized: false
  },
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

export default redis;

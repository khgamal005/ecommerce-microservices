import Redis from "ioredis";



const redis =new Redis({
    UPSTASH_REDIS_REST_URL="https://quick-elf-32578.upstash.io"
: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,

})

export default redis;
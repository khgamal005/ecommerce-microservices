import Redis from "ioredis";



const redis =new Redis({
    u: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,

})

export default redis;
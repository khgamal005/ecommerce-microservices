import Redis from "ioredis";



const redis =new Redis({
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_TOKEN,

})

export default redis;



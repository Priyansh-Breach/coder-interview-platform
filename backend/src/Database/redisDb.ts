import { Redis } from "ioredis";
require("dotenv").config();

/**
 * Upstash Redis connection
 */

const redisClient = () => {
  if (process.env.UPSTASH_REDIS_URL) {
    console.log(`Connected to Redis`);
    return process.env.UPSTASH_REDIS_URL;
  }
  throw new Error(`Connection to Redis is failed`);
  
};

export const connectRedis = new Redis(redisClient());
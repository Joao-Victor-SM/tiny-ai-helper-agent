import { createClient } from "redis";

const redis = createClient({
  socket: {
    host: "neo-aapanel",
    port: 6379
  },
});

export const REDIS_DEFAULT_BUCKET = "default";

export async function nextReminderId(bucket = REDIS_DEFAULT_BUCKET) {
  return await redis.incr(`reminder:${bucket}:nextId`);
}

export async function initRedis() {
  await redis.connect();
  return redis;
}

export default redis;
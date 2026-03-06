import { tool } from "@lmstudio/sdk";
import zod from "zod";
import redis, { nextReminderId, REDIS_DEFAULT_BUCKET } from "../utils/redis";



//Memory 
export const storeMemoryTool = tool({
  name: "store_memory",
  description: "Store a piece of information for later retrieval",
  parameters: {
    key: zod.string(),
    value: zod.union([zod.string(), zod.number()]),
  },
  implementation: async ({ key, value }) => {
    await redis.set(`memory:${key}`, String(value));
    return `Stored memory for key: ${key}`;
  },
});

export const checkKeys = tool({
  name: "memory_keys",
  description: "Return a list of all keys currently stored in memory",
  parameters: {},
  implementation: async () => {
    const keys = await redis.keys("memory:*");
    return keys.map(k => k.replace(/^memory:/, ""));
  },
});

export const recallMemoryTool = tool({
  name: "recall_memory",
  description:
    "Retrieve a value using its exact key. If you are unsure of the key, use memory_keys first instead of guessing.",
  parameters: {
    key: zod.string(),
  },
  implementation: async ({ key }) => {
    const val = await redis.get(`memory:${key}`);
    return val ?? "No memory found for that key";
  },
});

// Reminder
export const addReminderTool = tool({
  name: "add_reminder",
  description:
    "Store a reminder message to recall later. Use when the user asks to be reminded of something.",
  parameters: {
    reminder: zod.string(),
    bucket: zod.string().optional(),
  },
  implementation: async ({ reminder, bucket }) => {
    const b = bucket || REDIS_DEFAULT_BUCKET;
    const id = await nextReminderId(b);
    await redis.hSet(`reminder:${b}`, id.toString(), reminder);
    return `Saved reminder #${id}: ${reminder}`;
  },
});

export const getRemindersTool = tool({
  name: "get_reminders",
  description: "Return a list of all saved reminders with their ids.",
  parameters: {
    bucket: zod.string().optional(),
  },
  implementation: async ({ bucket }) => {
    const b = bucket || REDIS_DEFAULT_BUCKET;
    const reminders = await redis.hGetAll(`reminder:${b}`);
    if (!Object.keys(reminders).length) return "No reminders saved.";
    return Object.entries(reminders).map(([id, text]) => ({
      id: Number(id),
      reminder: text,
    }));
  },
});

export const removeReminderTool = tool({
  name: "remove_reminder",
  description:
    "Remove a reminder by id. Always call get_reminders first to know the ids.",
  parameters: {
    id: zod.number(),
    bucket: zod.string().optional(),
  },
  implementation: async ({ id, bucket }) => {
    const b = bucket || REDIS_DEFAULT_BUCKET;
    const reminder = await redis.hGet(`reminder:${b}`, id.toString());
    if (!reminder) return `No reminder found for id ${id}`;
    await redis.hDel(`reminder:${b}`, id.toString());
    return `Removed reminder #${id}: ${reminder}`;
  },
});

export const removeReminderByTextTool = tool({
  name: "remove_reminder_by_text",
  description:
    "Remove a reminder by matching its content. Always call get_reminders first to see the exact text.",
  parameters: {
    reminder: zod.string(),
    bucket: zod.string().optional(),
  },
  implementation: async ({ reminder, bucket }) => {
    const b = bucket || REDIS_DEFAULT_BUCKET;
    const reminders = await redis.hGetAll(`reminder:${b}`);
    const target = reminder.toLowerCase();
    for (const [id, text] of Object.entries(reminders)) {
      if (text.toLowerCase().includes(target)) {
        await redis.hDel(`reminder:${b}`, id);
        return `Removed reminder #${id}: ${text}`;
      }
    }
    return `No reminder found matching: ${reminder}`;
  },
});
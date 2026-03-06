import { tool } from "@lmstudio/sdk";
import zod from "zod";

const memory = new Map<string, string>();
// Reminders are stored as a nested map: bucket -> id -> reminder text
const reminderBuckets = new Map<string, Map<number, string>>();
const DEFAULT_BUCKET = "default";
let reminderId = 1;

function getReminderBucket() {
  let bucket = reminderBuckets.get(DEFAULT_BUCKET);
  if (!bucket) {
    bucket = new Map<number, string>();
    reminderBuckets.set(DEFAULT_BUCKET, bucket);
  }
  return bucket;
}

export const storeMemoryTool = tool({
  name: "store_memory",
  description: "Store a piece of information for later retrieval",
  parameters: {
    key: zod.string(),
    value: zod.union([zod.string(), zod.number()]),
  },
  implementation: ({ key, value }) => {
    memory.set(key, String(value));
    return `Stored memory for key: ${key}`;
  },
});
export const checkKeys = tool({
  name: "memory_keys",
  description: "Return a list of all keys currently stored in memory",
  parameters: {},
  implementation: () => Array.from(memory.keys()),
});
export const recallMemoryTool = tool({
  name: "recall_memory",
  description:
    "Retrieve a value using its exact key. If you are unsure of the key, use memory_keys first instead of guessing.",
  parameters: {
    key: zod.string(),
  },
  implementation: ({ key }) => {
    return memory.get(key) ?? "No memory found for that key";
  },
});

export const addReminderTool = tool({
  name: "add_reminder",
  description:
    "Store a reminder message to recall later. Use when the user asks to be reminded of something.",
  parameters: {
    reminder: zod.string(),
  },
  implementation: ({ reminder }) => {
    const id = reminderId++;
    const bucket = getReminderBucket();
    bucket.set(id, reminder);
    return `Saved reminder #${id}: ${reminder}`;
  },
});

export const getRemindersTool = tool({
  name: "get_reminders",
  description: "Return a list of all saved reminders with their ids.",
  parameters: {},
  implementation: () => {
    const bucket = getReminderBucket();
    if (!bucket.size) return "No reminders saved.";
    return Array.from(bucket.entries()).map(([id, text]) => ({
      id,
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
  },
  implementation: ({ id }) => {
    const bucket = getReminderBucket();
    const reminder = bucket.get(id);
    if (!reminder) return `No reminder found for id ${id}`;

    bucket.delete(id);
    return `Removed reminder #${id}: ${reminder}`;
  },
});

export const removeReminderByTextTool = tool({
  name: "remove_reminder_by_text",
  description:
    "Remove a reminder by matching its content. Always call get_reminders first to see the exact text.",
  parameters: {
    reminder: zod.string(),
  },
  implementation: ({ reminder }) => {
    const bucket = getReminderBucket();
    if (!bucket.size) return "No reminders saved.";

    const target = reminder.toLowerCase();
    for (const [id, text] of bucket.entries()) {
      if (text.toLowerCase().includes(target)) {
        bucket.delete(id);
        return `Removed reminder #${id}: ${text}`;
      }
    }
    return `No reminder found matching: ${reminder}`;
  },
});

import { ChatMessageRoleData } from "@lmstudio/sdk";

interface PreChatMessage {
  role: ChatMessageRoleData;
  message: string;
}
const preChats: PreChatMessage[] = [
  {
    role: "system",
    message: `
You have a memory system.

Tools:
- store_memory: save information (key, value)
- recall_memory: retrieve information using the exact key
- memory_keys: list available keys
- add_reminder: store a reminder message when the user asks to be reminded
- get_reminders: list all saved reminders with their ids
- remove_reminder: delete a reminder by id (always list first)
- remove_reminder_by_text: delete a reminder by matching its content (always list first)

Rules:
1) If the user asks for stored information always call memory_keys first. Don't guess keys
2) After seeing the keys, choose the most relevant key and call recall_memory.
3) If the user asks to be reminded of something, call add_reminder with the full reminder text.
4) If the user wants to review or delete reminders, call get_reminders first. Delete via remove_reminder (id) or remove_reminder_by_text (content).
`,
  },
];
export default preChats;

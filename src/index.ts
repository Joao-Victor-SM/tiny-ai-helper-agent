import { Chat } from "@lmstudio/sdk";
import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";

import { bootPCtool, shutdownPCtool } from "./tools/powerPCTools";
import { NmultiplicationTool, expEvalTool } from "./tools/mathTools";
import {
  addReminderTool,
  checkKeys,
  getRemindersTool,
  recallMemoryTool,
  removeReminderTool,
  removeReminderByTextTool,
  storeMemoryTool,
} from "./tools/memoryTools";

import preChats from "./preChats";
import { modelPromise } from "./lmstudio";

const args = process.argv.slice(2);

const tools = [
  bootPCtool,
  shutdownPCtool,
  NmultiplicationTool,
  expEvalTool,
  storeMemoryTool,
  recallMemoryTool,
  checkKeys,
  addReminderTool,
  getRemindersTool,
  removeReminderTool,
  removeReminderByTextTool,
];

async function runPrompt(userInput: string) {
  const model = await modelPromise;
  const chat = Chat.empty();

  preChats.forEach((msg) => chat.append(msg.role, msg.message));
  chat.append(userInput);

  await model.act(chat, tools, {
    onMessage: (message) => console.log(message.toString()),
  });
}

async function runInteractive() {
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  while (true) {
    try {
      const userInput = await rl.question("> ");
      await runPrompt(userInput);
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

async function runCli() {
  const input = args.join(" ");
  await runPrompt(input);
}

async function main() {
  if (args.length) return await runCli();
  await runInteractive();
}

main();

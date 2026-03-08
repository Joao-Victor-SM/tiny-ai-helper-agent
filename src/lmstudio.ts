import { LMStudioClient } from "@lmstudio/sdk";
const client = new LMStudioClient({baseUrl:"ws://bot:1234"});

const modelPromise = client.llm.model("qwen3.5-2b");

export { client, modelPromise };

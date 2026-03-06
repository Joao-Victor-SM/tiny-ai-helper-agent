import { LMStudioClient } from "@lmstudio/sdk";

const client = new LMStudioClient();
const modelPromise = client.llm.model("qwen3.5-2b");

export { client, modelPromise };

import { tool } from "@lmstudio/sdk";
import axios from "axios";

export const bootPCtool = tool({
  name: "boot-pc",
  description: "boots up the computer",
  parameters: {},
  implementation: async () => {
    try {
      await axios.get("http://neo-aapanel:3000/power/on");
      return "Sucess, pc is booting";
    } catch (error) {
      return { msg: "there was an error", error };
    }
  },
});
export const shutdownPCtool = tool({
  name: "shutdown-pc",
  description: "shutdown the computer",
  parameters: {},
  implementation: async () => {
    try {
      await axios.get("http://neo-aapanel:3000/power/off");
      return "Sucess, pc is shutting down";
    } catch (error) {
      return { msg: "there was an error", error };
    }
  },
});

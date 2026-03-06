import { tool } from "@lmstudio/sdk";
import zod from "zod";

export const NmultiplicationTool = tool({
  name: "multiplication",
  description: "Give a list of numbers, return their multiplication",
  parameters: { numbers: zod.array(zod.number()) },
  implementation: ({ numbers }) => numbers.reduce((acc, curr) => acc * curr, 1),
});

function safeMath(expr: string) {
  if (expr.length > 200) throw new Error("too long");
  if (!/^[0-9+\-*/(). ]+$/.test(expr)) throw new Error("invalid");

  return Function(`return (${expr})`)();
}
export const expEvalTool = tool({
  name: "calculate_math_expression",
  description:
    "Evaluate a math expression. Always use this tool for any arithmetic instead of calculating yourself.",
  parameters: { expression: zod.string() },
  implementation: ({ expression }) => {
    try {
      return safeMath(expression);
    } catch (error) {
      return String(error);
    }
  },
});

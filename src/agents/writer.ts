import { groq } from "../lib/constants";

export async function runWriterStream(
  userQuery: string,
  planSteps: string[],
  researchNotes: string[] | null
) {
  return await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    stream: true,
    messages: [
      {
        role: "system",
        content: `
You are a WRITER AGENT.

Rules:
- Write the final answer for the user
- Use clear structure and simple language
- Use markdown when helpful
- If research notes are provided, rely on them
- Do NOT mention planner or researcher
- Do NOT invent facts
        `.trim(),
      },
      {
        role: "user",
        content: `
                User Question
                ${userQuery}
                Plan:
                ${planSteps.join("\n")}
                Research notes :
                ${researchNotes?.join("\n") ?? "None"}`.trim(),
      },
    ],
  });
}

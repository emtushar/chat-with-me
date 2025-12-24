import { groq } from "../lib/constants";

export type ResearchResult = {
  notes: string[];
};

export async function runResearcher(
  userQuery: string,
  planSteps: string[]
): Promise<ResearchResult> {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are a RESEARCH AGENT.

Rules:
- Gather factual information only
- Do NOT explain to the user
- Do NOT format nicely
- Do NOT answer directly
- Produce bullet-style research notes

Return ONLY valid JSON in this schema:

{
  "notes": string[]
}

Notes should be short, factual, and useful for a writer agent.
        `.trim(),
      },
      {
        role: "user",
        content: `
        User Question:
        ${userQuery}
        Planned steps:
        ${planSteps.join("\n")}`.trim(),
      },
    ],
  });
  return JSON.parse(response.choices[0].message.content!);
}

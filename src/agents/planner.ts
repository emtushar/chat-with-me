import { groq } from "../lib/constants";

export type PlanResult = {
  needsResearch: boolean;
  steps: string[];
};

export async function runPlanner(userQuery: string): Promise<PlanResult> {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
You are a PLANNING AGENT.

You do NOT answer the user.
You do NOT explain concepts.
You ONLY plan actions.

Your task:
- Decide if external research is required.
- Return a high-level action plan.

STRICT RULES:
- Steps must be ACTIONS, not explanations.
- Steps must be short verbs (e.g. "Explain X", "Compare A vs B").
- NEVER include factual content.
- Return ONLY valid JSON in the exact schema.

Schema:
{
  "needsResearch": boolean,
  "steps": string[]
}

BAD step ❌:
"LLMs are trained on large datasets"

GOOD step ✅:
"Explain what an LLM is"
"Describe how LLMs are trained"
        `.trim(),
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
    temperature: 0,
  });
  return JSON.parse(response.choices[0].message.content!);
}

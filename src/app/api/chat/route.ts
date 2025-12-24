import { NextResponse } from "next/server";
import { runPlanner } from "../../../agents/planner";
import { runResearcher } from "../../../agents/researcher";
import { runWriterStream } from "../../../agents/writer";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages.at(-1)?.content;
  const plan = await runPlanner(lastUserMessage);
  let research = plan.needsResearch
    ? await runResearcher(lastUserMessage, plan.steps)
    : null;

  const stream = await runWriterStream(
    lastUserMessage,
    plan.steps,
    research?.notes ?? null
  );

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) controller.enqueue(encoder.encode(token));
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

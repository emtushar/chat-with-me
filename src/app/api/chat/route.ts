import { NextResponse } from "next/server";
import { ChatMessage } from "@/types/chat";

interface ChatRequest {
  messages: Pick<ChatMessage, "role" | "content">[];
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;
  const lastMessage = body.messages.at(-1);
  console.log(lastMessage);
  if (!lastMessage || lastMessage.role !== "user") {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
  return NextResponse.json(
    {
      role: "assistant",
      content: `you said , ${lastMessage?.content}`,
    },
    { status: 200 }
  );
}

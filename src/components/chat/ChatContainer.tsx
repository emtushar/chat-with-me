"use client";
import { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { generateId } from "@/lib/utils";

function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const addUserMsg = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsResponding(true);
    // setTimeout(() => {
    //   const aiMessage: ChatMessageType = {
    //     id: generateId(),
    //     role: "assistant",
    //     content: "This is Assistant reply",
    //   };
    //   setMessages((prev) => [...prev, aiMessage]);
    //   setIsResponding(false);
    // }, 500);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: data.role, content: data.content },
      ]);
      setIsResponding(false);
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setIsResponding(false);
    }
  };
  return (
    <div>
      <div className="bg-amber-200 p-10 border-8 text-stone-700 ">
        <h3 className="text-2xl m-2">Chat History</h3>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isResponding && <p>Assistant is thinking ...</p>}
      </div>

      <div>
        <ChatInput onSend={addUserMsg} disabled={isResponding} />
      </div>
    </div>
  );
}

export default ChatContainer;

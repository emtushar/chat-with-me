import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProp {
  message: ChatMessageType;
}
function ChatMessage({ message }: ChatMessageProp) {
  const { role, content } = message;
  return (
    <div>
      <div
        className={`${
          role === "user" ? "bg-blue-500" : "bg-gray-200 text-black"
        } my-3 p-2`}
      >
        {`${role === "user" ? "You: " : "Ai: "} ${content}`}
      </div>
    </div>
  );
}

export default ChatMessage;

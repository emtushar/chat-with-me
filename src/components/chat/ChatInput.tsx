"use client";
import { useState } from "react";
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSend(userInput.trim());
    setUserInput("");
  };
  return (
    <div>
      <div className="flex p-2">
        <form onSubmit={handleSubmit}>
          <input
            disabled={disabled}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask Anything ..."
          />
          <button
            className={`${
              userInput.length < 1
                ? "bg-gray-500 text-gray-700 "
                : "text-shadow-indigo-100 bg-sky-700 cursor-pointer"
            } p-2 rounded-md `}
            disabled={disabled || userInput.length === 0}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;

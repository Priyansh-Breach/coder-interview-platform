import { useState } from "react";
import { useAppSelector } from "@/redux/store";

export default function Component() {
  const [messages, setMessages] = useState([
    {
      id: 2,
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:02 AM",
    },
  ]);
  const userMessage = useAppSelector((state:any)=>state.editor.userMessage)

  return (
    <div className="flex flex-col h-screen  bg-background text-foreground">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                message.sender === "You"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              } rounded-lg p-3`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

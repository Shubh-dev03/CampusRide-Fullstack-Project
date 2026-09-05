import React, { useEffect, useRef, useState } from "react";
import { BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

function Ryde() {
  const RydeAvatar = () => {
    return (
      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
        <BotIcon />
      </div>
    );
  };

  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Ryde! How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");

  //Scroll to new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      console.log("Ryde API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Ryde error:", error);

      const errorMessage = {
        role: "assistant",
        content:
          error.message || "Sorry, something went wrong. Please try again.",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isOpen ? (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-xl border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="font-semibold text-lg">Ryde</h2>
              <p className="text-sm text-gray-500">Your CampusRide assistant</p>
            </div>

            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="h-96 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && <RydeAvatar />}

                <div
                  className={`rounded-xl p-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal ml-5 space-y-1">
                          {children}
                        </ol>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc ml-5 space-y-1">{children}</ul>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 rounded-xl p-3 w-fit">
                Ryde is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-4 border-t">
            <input
              type="text"
              placeholder="Ask Ryde..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          <BotIcon />
        </button>
      )}
    </div>
  );
}

export default Ryde;

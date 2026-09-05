import React, { useEffect, useRef, useState } from "react";
import { BotIcon, MessageSquareCode } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

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

  // Scroll to new message
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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          messages: updatedMessages,
        },
      );

      console.log("Ryde API response:", data);

      if (!data.reply) {
        throw new Error("No response from Ryde.");
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
          error.response?.data?.error ||
          error.message ||
          "Sorry, something went wrong. Please try again.",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isOpen ? (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-h-[calc(100vh-2rem)] rounded-2xl border bg-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold">Ryde</h2>
              <p className="text-sm text-gray-500">Your CampusRide assistant</p>
            </div>

            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="h-[60vh] max-h-96 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && <RydeAvatar />}

                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
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
                        <ol className="ml-5 list-decimal space-y-1">
                          {children}
                        </ol>
                      ),

                      ul: ({ children }) => (
                        <ul className="ml-5 list-disc space-y-1">{children}</ul>
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
              <div className="w-fit rounded-xl bg-gray-100 p-3">
                Ryde is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t p-4">
            <input
              type="text"
              placeholder="Ask Ryde..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 rounded-xl px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50"
        >
          <MessageSquareCode />
        </button>
      )}
    </div>
  );
}

export default Ryde;

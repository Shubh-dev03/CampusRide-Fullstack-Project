import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const SUGGESTED_PROMPTS = [
  "How do I book a ride?",
  "How do I post a ride?",
  "Safety tips",
];

function RydeAvatar() {
  return (
    <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <Bot className="h-4 w-4" />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-primary-light px-3.5 py-3 dark:bg-surface-dark">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-primary"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function Ryde() {
  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Ryde! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  // Scroll to new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const newMessage = {
      role: "user",
      content: text,
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
        isError: true,
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
        <div
          className="fixed bottom-4 left-4 right-4 z-50 flex max-h-[calc(100vh-2rem)] animate-panel-in flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-raised dark:border-border-dark dark:bg-surface-dark-raised sm:bottom-6 sm:left-auto sm:right-6 sm:w-96"
          role="dialog"
          aria-label="Ryde chat assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5 dark:border-border-dark">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <Bot className="h-[18px] w-[18px]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink dark:text-ink-dark">
                  Ryde
                </h2>
                <p className="text-xs text-ink-soft dark:text-ink-dark-soft">
                  Your CampusRide assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition hover:bg-primary-light hover:text-ink dark:text-ink-dark-soft dark:hover:bg-surface-dark"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[60vh] max-h-96 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && <RydeAvatar />}

                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : message.isError
                        ? "border border-danger/30 bg-danger/10 text-danger"
                        : "bg-primary-light text-ink dark:bg-surface-dark dark:text-ink-dark"
                  }`}
                >
                  {message.isError && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Something went wrong
                    </div>
                  )}
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

            {/* Suggested prompts — only before the conversation has started */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pl-9">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-primary hover:text-primary dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark-soft"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <RydeAvatar />
                <TypingDots />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-border p-3 dark:border-border-dark">
            <input
              type="text"
              placeholder="Ask Ryde..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="flex shrink-0 items-center justify-center rounded-control bg-primary px-3.5 text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Ryde chat assistant"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-raised transition hover:scale-105 hover:bg-primary-hover"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default Ryde;

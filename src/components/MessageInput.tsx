import { useMutation } from "convex/react";
import { useState, useRef, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { withConvexProvider } from "../lib/convex";
import { clsx } from "clsx";

function MessageInputComponent() {
  const sendMessage = useMutation(api.messages.sendMessage);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Load author name from localStorage
  useEffect(() => {
    const savedAuthor = localStorage.getItem("chat-author-name");
    if (savedAuthor) {
      setAuthor(savedAuthor);
    }
  }, []);

  // Save author name to localStorage when it changes
  useEffect(() => {
    if (author) {
      localStorage.setItem("chat-author-name", author);
    }
  }, [author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!author.trim() || !body.trim()) {
      setError("Please enter both your name and a message");
      return;
    }

    setIsLoading(true);
    try {
      await sendMessage({
        author: author.trim(),
        body: body.trim(),
      });

      // Clear message input and focus it
      setBody("");
      messageInputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Author name input */}
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <input
            ref={messageInputRef}
            type="text"
            placeholder="Type your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !author.trim() || !body.trim()}
            className={clsx(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              isLoading || !author.trim() || !body.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600",
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Export the wrapped component as default
const MessageInput = withConvexProvider(MessageInputComponent);
export default MessageInput;

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { withConvexProvider } from "../lib/convex";
import { clsx } from "clsx";

function MessageListComponent() {
  const messages = useQuery(api.messages.getMessages);
  const messageCount = useQuery(api.messages.getMessageCount);

  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Chat header with stats */}
      <div className="text-center text-sm text-gray-500 mb-6">
        {messageCount} messages in this chat
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Be the first to start the conversation!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message._id}
              className={clsx(
                "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                "bg-blue-500 text-white ml-auto",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium opacity-90">
                  {message.author}
                </span>
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{message.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export the wrapped component as default
const MessageList = withConvexProvider(MessageListComponent);
export default MessageList;

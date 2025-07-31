import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all messages (with real-time updates!)
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get the last 50 messages, ordered by timestamp
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_timestamp")
      .order("desc")
      .take(50);

    // Return them in chronological order (oldest first)
    return messages.reverse();
  },
});

// Mutation to send a new message
export const sendMessage = mutation({
  args: {
    author: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate input
    if (!args.author.trim()) {
      throw new Error("Author name is required");
    }

    if (!args.body.trim()) {
      throw new Error("Message cannot be empty");
    }

    // Insert the message with current timestamp
    await ctx.db.insert("messages", {
      author: args.author.trim(),
      body: args.body.trim(),
      timestamp: Date.now(),
    });
  },
});

// Query to get message count (for stats)
export const getMessageCount = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return messages.length;
  },
});

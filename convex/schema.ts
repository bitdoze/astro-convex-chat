import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user information
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Messages table for chat messages
  messages: defineTable({
    author: v.string(),
    body: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  // Rooms table for different chat rooms (future enhancement)
  rooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPrivate: v.boolean(),
  }),
});

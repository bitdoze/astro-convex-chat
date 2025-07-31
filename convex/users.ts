import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a user
export const getOrCreateUser = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    let user = null;
    if (args.email) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
    }

    // Create new user if not found
    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
      });
      user = await ctx.db.get(userId);
    }

    return user;
  },
});

// Get online users count
export const getActiveUsersCount = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

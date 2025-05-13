import { sql } from "drizzle-orm";
import { createTable } from "./_table";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = createTable("users_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar ("username").unique(),
  displayName: varchar ("display_name").default(sql`NULL`),
  email: varchar ("email").notNull().unique(),
  thumbnailUrl: varchar ("thumbnail_url"),
  providerUsername: varchar ("provider_username"),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
});
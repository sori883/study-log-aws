import { sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";

export const usersTable = createCaTable("users_table", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").unique(),
  displayName: text("display_name"),
  email: text("email").notNull().unique(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at").default(sql`NULL`),
});

import { sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";

export const usersTable = createCaTable("users_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().notNull().unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at").default(sql`NULL`),
});


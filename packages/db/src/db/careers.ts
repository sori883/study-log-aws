import { relations, sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";

export const careersTable = createCaTable("careers_table", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  startAt: text(),
  endAt: text(),
  userId: integer("user_id", { mode: "number" }).references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at").default(sql`NULL`),
});

export const careersRelations = relations(careersTable, ({ one }) => ({
  user: one(usersTable, { 
      fields: [careersTable.userId],
      references: [usersTable.id]
    }),
}));
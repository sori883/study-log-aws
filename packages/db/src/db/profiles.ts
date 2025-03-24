import { relations, sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";

export const profilesTable = createCaTable("profiles_table", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  bio: text("bio"),
  birthDay: text("birth_day"),
  location: text("location"),
  userId: integer("user_id", { mode: "number" }).references(() => usersTable.id, {onDelete: "cascade"}).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at").default(sql`NULL`),
});

export const profilesRelations = relations(profilesTable, ({ one }) => ({
	user: one(usersTable, { 
      fields: [profilesTable.userId],
      references: [usersTable.id]
    }),
}));
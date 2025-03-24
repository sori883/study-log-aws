import { relations, sql } from "drizzle-orm";
import { createCaTable } from "./_table";
import { integer, text } from "drizzle-orm/sqlite-core";
import { profilesTable } from "./profiles";
import { careersTable } from "./careers";

export const usersTable = createCaTable("users_table", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  thumbnailUrl: text("thumbnail_url"),
  profileId: integer("profile_id", { mode: "number" }),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at").default(sql`NULL`),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	profile: one(profilesTable, {
    fields: [usersTable.profileId],
    references: [profilesTable.id],
  }),
  career: many(careersTable),
}));
import { relations, sql } from "drizzle-orm";
import { createTable } from "./_table";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users"
import { tasksTable } from "./tasks";
import { projectToWeekly } from "./weeklys";

export const projectColorEnum = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "gray",
] as const; 

export const projectsTable = createTable("projects_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("project_name").unique(),
  color: varchar("project_color", { enum: projectColorEnum } ).unique(),
  
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
});

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [projectsTable.userId],
    references: [usersTable.id],
  }),
  tasks: many(tasksTable),
  projectToWeekly: many(projectToWeekly)
}));
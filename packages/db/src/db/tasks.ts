import { relations, sql } from "drizzle-orm";
import { createTable } from "./_table";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users"
import { projectsTable } from "./projects";

export const taskColorEnum = [
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

export const taskStatusEnum = ["stop", "doing", "done"] as const; 

export const tasksTable = createTable("tasks_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("task_name", { enum: taskColorEnum } ).default("gray"),
  status: varchar("task_status", { enum: taskStatusEnum }).default(sql`NULL`),  

  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").notNull(),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
});

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [tasksTable.userId],
    references: [usersTable.id],
  }),
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id],
  })
}));
import { relations, sql } from "drizzle-orm";
import { createTable } from "./_table";
import { integer, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const weeklysTable = createTable("weeklys_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  totalSeconds: integer("total_seconds").default(0).notNull(),

  userId: uuid("user_id").notNull(),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
});

// Weeklysとrojectsの中間テーブル
export const projectToWeekly = createTable("projects_to_weeklys", {
    projectId: uuid("project_id").notNull(),
    weeklyId: uuid("weekly_id").notNull(),
    ScheduledTime: integer("scheduled_time").default(0).notNull(),
    createdAt: timestamp("create_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at").default(sql`NULL`),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.weeklyId] }),
  ],
);

export const weeklysRelations = relations(weeklysTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [weeklysTable.userId],
    references: [usersTable.id],
  }),
  projectToWeekly: many(projectToWeekly)
}));

export const projectToWeeklyRelations = relations(projectToWeekly, ({ one }) => ({
  project: one(projectsTable, {
    fields: [projectToWeekly.projectId],
    references: [projectsTable.id],
  }),
  weekly: one(weeklysTable, {
    fields: [projectToWeekly.weeklyId],
    references: [weeklysTable.id],
  }),
}));
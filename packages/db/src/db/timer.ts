import { eq, relations, sql } from "drizzle-orm";
import { createTable } from "./_table";
import { boolean, integer, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { tasksTable } from "./tasks";
import { timerSessionsTable } from "./timerSessions";

export const timersTable = createTable("timers_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  totalSeconds: integer("total_seconds").default(0).notNull(),
  isRunning: boolean("is_running").default(false).notNull(),

  userId: uuid("user_id").notNull(),
  taskId: uuid("task_id").notNull().unique(),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
}, (table) => ({
  // 1人のユーザーが同時に実行できるタイマーは1つのみ
  uniqueRunningTimer: uniqueIndex("idx_one_running_timer_per_user")
    .on(table.userId)
    .where(sql`${table.isRunning} = true`),
}));

export const timerRelations = relations(timersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [timersTable.userId],
    references: [usersTable.id],
  }),
  task: one(tasksTable, { 
    fields: [timersTable.taskId],
    references: [tasksTable.id],
  }),
  timerSessionsTable: many(timerSessionsTable)
}));
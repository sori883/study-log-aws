import { relations, sql } from "drizzle-orm";
import { createTable } from "./_table";
import { integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users"
import { tasksTable } from "./tasks";
import { timersTable } from "./timer";


export const timerSessionsTable = createTable("timer_sessions_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds").default(0).notNull(), // セッション時間（秒）

  userId: uuid("user_id").notNull(),
  taskId: uuid("task_id").notNull().unique(),
  timerId: uuid("timer_id").notNull().references(() => timersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at").default(sql`NULL`),
});

export const timerSessionsRelations = relations(timerSessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [timerSessionsTable.userId],
    references: [usersTable.id],
  }),
  task: one(tasksTable, {
    fields: [timerSessionsTable.taskId],
    references: [tasksTable.id],
  }),
  timer: one(timersTable, {
    fields: [timerSessionsTable.timerId],
    references: [timersTable.id],
  })
}));
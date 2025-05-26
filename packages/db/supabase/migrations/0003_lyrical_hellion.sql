CREATE TABLE "study_aws_timers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_seconds" integer DEFAULT 0 NOT NULL,
	"is_running" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "study_aws_timers_table_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
CREATE TABLE "study_aws_timer_sessions_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"user_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"timer_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "study_aws_timer_sessions_table_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
ALTER TABLE "study_aws_timer_sessions_table" ADD CONSTRAINT "study_aws_timer_sessions_table_timer_id_study_aws_timers_table_id_fk" FOREIGN KEY ("timer_id") REFERENCES "public"."study_aws_timers_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_one_running_timer_per_user" ON "study_aws_timers_table" USING btree ("user_id") WHERE "study_aws_timers_table"."is_running" = true;
ALTER TABLE "study_aws_timer_sessions_table" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "study_aws_timer_sessions_table" CASCADE;--> statement-breakpoint
DROP INDEX "idx_one_running_timer_per_user";--> statement-breakpoint
ALTER TABLE "study_aws_timers_table" DROP COLUMN "is_running";
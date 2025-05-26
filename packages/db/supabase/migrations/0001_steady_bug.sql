CREATE TABLE "study_aws_projects_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_name" varchar,
	"project_color" varchar,
	"user_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "study_aws_projects_table_project_name_unique" UNIQUE("project_name"),
	CONSTRAINT "study_aws_projects_table_project_color_unique" UNIQUE("project_color")
);
--> statement-breakpoint
CREATE TABLE "study_aws_tasks_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_name" varchar DEFAULT 'gray',
	"started_at" timestamp DEFAULT NULL,
	"stopped_at" timestamp DEFAULT NULL,
	"task_status" varchar DEFAULT NULL,
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL
);
--> statement-breakpoint
ALTER TABLE "study_aws_users_table" RENAME COLUMN "createdAt" TO "create_at";
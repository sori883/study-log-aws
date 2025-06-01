CREATE TABLE "study_aws_projects_to_weeklys" (
	"project_id" uuid NOT NULL,
	"weekly_id" uuid NOT NULL,
	"scheduled_time" integer DEFAULT 0 NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "study_aws_projects_to_weeklys_project_id_weekly_id_pk" PRIMARY KEY("project_id","weekly_id")
);
--> statement-breakpoint
CREATE TABLE "study_aws_weeklys_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_seconds" integer DEFAULT 0 NOT NULL,
	"user_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL
);

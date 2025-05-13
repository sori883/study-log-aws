CREATE TABLE "study_aws_users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar,
	"display_name" varchar DEFAULT NULL,
	"email" varchar NOT NULL,
	"thumbnail_url" varchar,
	"provider_username" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "study_aws_users_table_username_unique" UNIQUE("username"),
	CONSTRAINT "study_aws_users_table_email_unique" UNIQUE("email")
);

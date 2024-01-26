CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ruc" bigint NOT NULL,
	CONSTRAINT "companies_name_unique" UNIQUE("name"),
	CONSTRAINT "companies_ruc_unique" UNIQUE("ruc")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "costumers" (
	"user_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"internal_code" text,
	"channel" text,
	CONSTRAINT "costumers_user_id_company_id_pk" PRIMARY KEY("user_id","company_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "costumers" ADD CONSTRAINT "costumers_user_id_clients_id_fk" FOREIGN KEY ("user_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "costumers" ADD CONSTRAINT "costumers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

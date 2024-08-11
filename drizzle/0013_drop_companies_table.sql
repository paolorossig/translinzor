DROP TABLE "companies";--> statement-breakpoint
ALTER TABLE "costumers" DROP CONSTRAINT "costumers_client_id_company_id_unique";--> statement-breakpoint
ALTER TABLE "costumers" DROP CONSTRAINT "costumers_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "costumers" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "costumers" DROP COLUMN IF EXISTS "company_id";--> statement-breakpoint
ALTER TABLE "costumers" ADD CONSTRAINT "costumers_client_id_internal_code_unique" UNIQUE("client_id","internal_code");
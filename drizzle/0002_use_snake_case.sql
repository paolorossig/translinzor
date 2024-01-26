ALTER TABLE "transportUnits" RENAME TO "transport_units";--> statement-breakpoint
ALTER TABLE "costumers" RENAME COLUMN "user_id" TO "client_id";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "licenseNumber" TO "license_number";--> statement-breakpoint
ALTER TABLE "drivers" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "transport_units" RENAME COLUMN "licensePlate" TO "license_plate";--> statement-breakpoint
ALTER TABLE "transport_units" RENAME COLUMN "grossWeight" TO "gross_weight";--> statement-breakpoint
ALTER TABLE "transport_units" RENAME COLUMN "netWeight" TO "net_weight";--> statement-breakpoint
ALTER TABLE "transport_units" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "costumers" DROP CONSTRAINT "costumers_user_id_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "costumers" DROP CONSTRAINT "costumers_user_id_company_id_pk";--> statement-breakpoint
ALTER TABLE "costumers" ADD CONSTRAINT "costumers_client_id_company_id_pk" PRIMARY KEY("client_id","company_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "costumers" ADD CONSTRAINT "costumers_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "transport_units" DROP COLUMN IF EXISTS "createdAt";
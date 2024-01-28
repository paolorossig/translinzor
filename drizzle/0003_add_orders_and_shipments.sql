CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"costumer_id" integer NOT NULL,
	"shipment_id" integer,
	"order_number" text NOT NULL,
	"guide_number" text NOT NULL,
	"destination_address" text NOT NULL,
	"destination_district" text NOT NULL,
	"total_value" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"delivered_at" timestamp,
	"refused_at" timestamp,
	"refused_reason" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"transport_unit_id" integer,
	"driver_id" integer,
	"delivery_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "costumers" DROP CONSTRAINT "costumers_client_id_company_id_pk";--> statement-breakpoint
ALTER TABLE "costumers" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_costumer_id_costumers_id_fk" FOREIGN KEY ("costumer_id") REFERENCES "costumers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_transport_unit_id_transport_units_id_fk" FOREIGN KEY ("transport_unit_id") REFERENCES "transport_units"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "costumers" ADD CONSTRAINT "costumers_client_id_company_id_unique" UNIQUE("client_id","company_id");
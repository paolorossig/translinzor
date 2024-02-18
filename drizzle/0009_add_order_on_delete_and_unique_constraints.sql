ALTER TABLE "orders" DROP CONSTRAINT "orders_shipment_id_shipments_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipment_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_dni_unique" UNIQUE("dni");--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_license_number_unique" UNIQUE("license_number");--> statement-breakpoint
ALTER TABLE "transport_units" ADD CONSTRAINT "transport_units_license_plate_unique" UNIQUE("license_plate");
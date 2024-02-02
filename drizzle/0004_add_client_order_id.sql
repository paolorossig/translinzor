ALTER TABLE "costumers" ALTER COLUMN "internal_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "client_order_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_costumer_id_client_order_id_unique" UNIQUE("costumer_id","client_order_id");
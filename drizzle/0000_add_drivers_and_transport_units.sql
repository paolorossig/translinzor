CREATE TABLE IF NOT EXISTS "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lastName" text NOT NULL,
	"dni" text NOT NULL,
	"licenseNumber" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transportUnits" (
	"id" serial PRIMARY KEY NOT NULL,
	"licensePlate" text NOT NULL,
	"type" text NOT NULL,
	"brand" text,
	"model" text,
	"capacity" text,
	"grossWeight" integer,
	"netWeight" integer,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

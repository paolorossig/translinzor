import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const transportUnits = pgTable('transportUnits', {
  id: serial('id').primaryKey(),
  licensePlate: text('licensePlate').notNull(),
  type: text('type').notNull(),
  brand: text('brand'),
  model: text('model'),
  capacity: text('capacity'),
  grossWeight: integer('grossWeight'),
  netWeight: integer('netWeight'),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export type TransportUnit = typeof transportUnits.$inferSelect

export const drivers = pgTable('drivers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('lastName').notNull(),
  dni: text('dni').notNull(),
  licenseNumber: text('licenseNumber').notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export type Driver = typeof drivers.$inferSelect

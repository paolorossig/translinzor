import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core'

export const transportUnits = pgTable('transport_units', {
  id: serial('id').primaryKey(),
  licensePlate: text('license_plate').notNull(),
  type: text('type').notNull(),
  brand: text('brand'),
  model: text('model'),
  capacity: text('capacity'),
  grossWeight: integer('gross_weight'),
  netWeight: integer('net_weight'),
  isActive: boolean('is_active').default(true).notNull(),
})

export type TransportUnit = typeof transportUnits.$inferSelect

export const drivers = pgTable('drivers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  dni: text('dni').notNull(),
  licenseNumber: text('license_number').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
})

export type Driver = typeof drivers.$inferSelect

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  ruc: bigint('ruc', { mode: 'number' }).unique().notNull(),
})

export const costumers = pgTable(
  'costumers',
  {
    clientId: integer('client_id')
      .references(() => clients.id)
      .notNull(),
    companyId: integer('company_id')
      .references(() => companies.id)
      .notNull(),
    internalCode: text('internal_code'),
    channel: text('channel'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.clientId, t.companyId] }),
  }),
)

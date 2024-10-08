import { relations } from 'drizzle-orm'
import {
  integer,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const transportUnits = pgTable('transport_units', {
  id: serial('id').primaryKey(),
  licensePlate: text('license_plate').notNull().unique(),
  type: text('type').notNull(),
  brand: text('brand'),
  model: text('model'),
  capacity: text('capacity'),
  grossWeight: integer('gross_weight'),
  netWeight: integer('net_weight'),
})

export type TransportUnit = typeof transportUnits.$inferSelect

export const drivers = pgTable('drivers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  dni: text('dni').unique().notNull(),
  licenseNumber: text('license_number').unique().notNull(),
})

export type Driver = typeof drivers.$inferSelect

const SupabaseAuthSchema = pgSchema('auth')
const SupabaseAuthUsers = SupabaseAuthSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const userRolesEnum = pgEnum('role', ['admin', 'client'] as const)
export type UserRole = (typeof userRolesEnum.enumValues)[number]

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .references(() => SupabaseAuthUsers.id, { onDelete: 'cascade' }),
  displayName: text('displayName').notNull(),
  email: text('email').notNull(),
  role: userRolesEnum('role').notNull(),
  clientId: uuid('client_id').references(() => clients.id),
})

export type User = typeof users.$inferSelect

export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
  costumers: many(costumers),
}))

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
})

export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  costumers: many(costumers),
  shipments: many(shipments),
}))

export const costumers = pgTable(
  'costumers',
  {
    id: serial('id').primaryKey(),
    clientId: uuid('client_id')
      .references(() => clients.id)
      .notNull(),
    internalCode: text('internal_code').notNull(),
    name: text('name').notNull(),
    channel: text('channel'),
    createdBy: uuid('created_by')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    uniq: unique().on(t.clientId, t.internalCode),
  }),
)

export const costumersRelations = relations(costumers, ({ one, many }) => ({
  client: one(clients, {
    fields: [costumers.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [costumers.createdBy],
    references: [users.id],
  }),
  orders: many(orders),
}))

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  costumerId: integer('costumer_id')
    .references(() => costumers.id)
    .notNull(),
  shipmentId: integer('shipment_id')
    .references(() => shipments.id, { onDelete: 'cascade' })
    .notNull(),
  clientOrderId: integer('client_order_id').notNull(),
  orderNumber: text('order_number').notNull(),
  guideNumber: text('guide_number').notNull(),
  destinationAddress: text('destination_address').notNull(),
  destinationDistrict: text('destination_district').notNull(),
  totalValue: numeric('total_value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  startedAt: timestamp('started_at'),
  deliveredAt: timestamp('delivered_at'),
  refusedAt: timestamp('refused_at'),
  refusedReason: text('refused_reason'),
})

export const ordersRelations = relations(orders, ({ one }) => ({
  costumer: one(costumers, {
    fields: [orders.costumerId],
    references: [costumers.id],
  }),
  shipment: one(shipments, {
    fields: [orders.shipmentId],
    references: [shipments.id],
  }),
}))

export type Order = typeof orders.$inferSelect
export type CreateOrder = typeof orders.$inferInsert

export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  clientId: uuid('client_id')
    .references(() => clients.id)
    .notNull(),
  transportUnitId: integer('transport_unit_id').references(
    () => transportUnits.id,
  ),
  driverId: integer('driver_id').references(() => drivers.id),
  route: text('route').notNull(),
  deliveryDate: timestamp('delivery_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  startedAt: timestamp('started_at'),
})

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  client: one(clients, {
    fields: [shipments.clientId],
    references: [clients.id],
  }),
  transportUnit: one(transportUnits, {
    fields: [shipments.transportUnitId],
    references: [transportUnits.id],
  }),
  driver: one(drivers, {
    fields: [shipments.driverId],
    references: [drivers.id],
  }),
  orders: many(orders),
}))

export type CreateShipment = typeof shipments.$inferInsert

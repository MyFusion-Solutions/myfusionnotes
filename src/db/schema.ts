import { pgTable, text, timestamp, uuid, jsonb, boolean } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plan: text('plan').default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id).notNull(),
  provider: text('provider').notNull(),
  type: text('type').notNull(),
  credentials: jsonb('credentials').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const syncJobs = pgTable('sync_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id).notNull(),
  ticketId: text('ticket_id').notNull(),
  crmNoteId: text('crm_note_id'),
  status: text('status').notNull(),
  log: text('log'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

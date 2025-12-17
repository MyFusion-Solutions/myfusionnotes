import { pgTable, text, timestamp, uuid, jsonb, boolean } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(), // Matches Clerk Organization ID or User ID
  name: text('name').notNull(),
  plan: text('plan').default('free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id).notNull(),
  provider: text('provider').notNull(), // 'zendesk', 'keap', 'hubspot'
  type: text('type').notNull(), // 'SUPPORT' or 'CRM'
  credentials: jsonb('credentials').notNull(), // Encrypted tokens
  isActive: boolean('is_active').default(true).notNull(),
  settings: jsonb('settings').default({}), // Metadata like domain, default tags
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const syncJobs = pgTable('sync_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id).notNull(),
  ticketId: text('ticket_id').notNull(),
  crmNoteId: text('crm_note_id'),
  status: text('status').notNull(), // 'PENDING', 'SUCCESS', 'FAILED'
  log: text('log'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

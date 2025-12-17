# Implementation Plan - MyFusion Notes 2025

**Goal**: Rebuild MyFusion Notes as a modern, AI-powered SaaS that bridges Support Desks (e.g., Zendesk, Freshdesk) and CRMs (e.g., Keap, HubSpot, Salesforce). The core value is syncing tickets as notes, enriched with AI summaries, while maintaining a lean Vercel-native architecture.

## Architecture

*   **Frontend/Backend Framework**: Next.js 14+ (App Router).
*   **Hosting**: Vercel.
*   **Database**: Vercel Postgres (Neon).
*   **Authentication**: Clerk (Multi-tenancy support is crucial for SaaS).
*   **AI**: Vercel AI SDK (OpenAI/Anthropic compatible) for ticket analysis.
*   **Styling**: Tailwind CSS + ShadcnUI (for premium, lean look).
*   **Queue/Jobs**: Inngest or Vercel Cron/Functions for reliable syncing (avoiding complex AWS SQS/Lambda setups).

## Billing & Subscription Infrastructure

*   **Provider**: Stripe.
*   **Integration**: Custom implementation (Clerk Billing is simpler but we want direct Stripe control for SaaS flexibility).
*   **Model**:
    *   **Free**: limited syncs/month.
    *   **Pro**: Unlimited syncs, AI features.
*   **Webhooks**: `api/webhooks/stripe` to handle `invoice.payment_succeeded`, `customer.subscription.deleted`.

## Conceptual Data Model (Postgres)

*   **Users/Tenants**: Managed via Clerk, mapped to `organizations` in DB.
*   **Subscriptions**: (Stripe Sync)
    *   `tenant_id`: FK to `tenants`.
    *   `stripe_customer_id`: text.
    *   `stripe_subscription_id`: text.
    *   `status`: 'active' | 'past_due' | 'canceled'.
    *   `plan_id`: 'price_...'
*   **Integrations**: Stores OAuth tokens/API keys for connected services.
    *   `type`: 'SUPPORT' | 'CRM'
    *   `provider`: 'zendesk' | 'keap' | 'hubspot' etc.
*   **Mappings**: specific rules for how data maps (e.g., Ticket Status -> CRM Tag).
*   **SyncLogs**: Audit trail of what was synced.

## Core Features

1.  **Universal Connector Engine**:
    *   Abstract interfaces for `SupportProvider` and `CrmProvider`.
    *   Easy addition of new platforms (e.g., just add a `SalesforceProvider` class).

2.  **The "Sync" Pipeline**:
    *   Webhook Listener (receive 'Ticket Solved' or 'Ticket Updated' from Helpdesk).
    *   Processor:
        *   Fetch full ticket details.
        *   **AI Step**: Generate Summary, Sentiment, and Action Items.
        *   Push to CRM as a "Note" or "Task".

3.  **The Sidebar (v2)**:
    *   Instead of a browser extension, modern Support Desks often allow "Apps" (iFrames).
    *   We can also build a Chrome Extension if deep integration is needed, but an iFrame based app is easier to maintain across browsers.

## AI Focus (The 2025 Twist)

*   **Smart Summaries**: Don't just dump the whole thread into the CRM. Summarize: "Customer reported login issue. Fixed by resetting token. Customer happy."
*   **Sentiment Tagging**: Tag contact in CRM as 'At Risk' if ticket sentiment was negative.
*   **Auto-Drafting**: Suggest CRM follow-up tasks based on ticket content.

## User Review Required

> [!IMPORTANT]
> **Organization Name**: Please confirm if the GitHub Organization is `myfusion-solutions` or `myfusion`.
> **Vercel Team**: Do you have a Vercel Team setup for `myfusion-solutions`?

## Proposed Changes

### Repo Setup
#### [NEW] `myfusionnotes`
*   Initialize Next.js App.
*   Setup Tailwind.
*   Setup Drizzle ORM (best for Vercel Postgres).

### Database
#### [NEW] `schema.ts`
*   Define tables for `tenants`, `integrations`, `sync_jobs`.

### Integrations
#### [NEW] `lib/integrations/`
*   `base-provider.ts` (Interface)
*   `zendesk.ts`
*   `keap.ts`

## Verification Plan

### Automated Tests
*   Unit tests for `KeapProvider` and `ZendeskProvider` logic (mocking API calls).
*   End-to-End test of the "Sync Pipeline" using mock webhook payloads.

### Manual Verification
*   Deploy to Vercel preview.
*   Connect a "Sandbox" Keap account and "Sandbox" Zendesk account.
*   Create a ticket -> data appears in Keap.

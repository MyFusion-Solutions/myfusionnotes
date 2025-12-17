# Deployment Guide - MyFusion Notes 2025

## 1. Environment Variables (Vercel)
Set the following issues in your Vercel Project Settings:

### Authentication (Clerk)
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: (From Clerk Dashboard)
*   `CLERK_SECRET_KEY`: (From Clerk Dashboard)

### Database (Neon/Vercel Postgres)
*   `POSTGRES_URL`: (Auto-added if you connect Vercel Storage)
*   `POSTGRES_...`: (All other variants auto-added)

### Billing (Stripe)
*   `STRIPE_SECRET_KEY`: (From Stripe Dashboard -> Developers -> API Keys)
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: (From Stripe Dashboard)
*   `STRIPE_WEBHOOK_SECRET`: (From Stripe Dashboard -> Developers -> Webhooks)
    *   *Note*: Point the webhook URL to `https://your-domain.com/api/webhooks/stripe`.

### AI (OpenAI)
*   `OPENAI_API_KEY`: (From OpenAI Platform)

### App Config
*   `NEXT_PUBLIC_APP_URL`: `https://your-project.vercel.app` (Or custom domain)

## 2. Database Migration
After deploying, run the migration to set up tables:
1.  Go to Vercel Dashboard -> Storage -> Postgres -> Query.
2.  (Better) Run locally: `POSTGRES_URL="your_connection_string" npx drizzle-kit migrate`
    *   *Or just copy the SQL from `drizzle/` and paste it into the Vercel Query Runner.*

## 3. Zendesk App
1.  Zip the `zendesk/` folder.
2.  Upload to Zendesk Admin -> Apps -> Upload Private App.
3.  **Important**: Update `zendesk/manifest.json` `url` to your real Vercel domain if it changes.

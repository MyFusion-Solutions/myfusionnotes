# MyFusion Notes 2025

**Clean. Lean. AI-Powered.**

MyFusion Notes is a SaaS platform that bridges the gap between Support Desks (Zendesk, Freshdesk, etc.) and CRMs (Keap, HubSpot, Salesforce). It syncs tickets as enriched notes, utilizing AI to summarize interactions and automate CRM updates.

## 🚀 Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Vercel Postgres](https://vercel.com/postgres) (Neon)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Clerk](https://clerk.com/)
- **AI**: Vercel AI SDK (OpenAI/Anthropic)
- **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Setup

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/MyFusion-Solutions/myfusionnotes.git
    cd myfusionnotes
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with:
    ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # Database (Vercel Postgres)
    POSTGRES_URL="postgres://..."
    POSTGRES_PRISMA_URL="..."
    POSTGRES_URL_NON_POOLING="..."
    POSTGRES_USER="..."
    POSTGRES_HOST="..."
    POSTGRES_PASSWORD="..."
    POSTGRES_DATABASE="..."
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Architecture

- **`src/app`**: Next.js App Router pages and API routes.
- **`src/lib`**: Shared utilities (DB connection, integration helpers).
- **`src/db`**: Database schema and migrations.
- **`src/components`**: React components.

## 🤖 AI Features

- **Ticket Summarization**: Condenses long support threads into concise CRM notes.
- **Sentiment Analysis**: Tags contacts based on interaction tone.
- **Action Items**: Extracts follow-up tasks for Sales/Success teams.

---

© 2025 MyFusion Solutions

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Cast to any to avoid strict type checks on specific fields like current_period_end
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any;

    if (!session?.metadata?.tenantId) {
      return new NextResponse("Tenant ID is required", { status: 400 });
    }

    await db.update(tenants).set({
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: 'pro'
    }).where(eq(tenants.id, session.metadata.tenantId));
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any;
    
    // Usually invoice payment succeeded just updates the period end
    await db.update(tenants).set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }).where(eq(tenants.stripeSubscriptionId, subscription.id));
  }
  
  // Handle cancellations
  if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      await db.update(tenants).set({
          plan: 'free'
      }).where(eq(tenants.stripeSubscriptionId, subscription.id));
  }

  return new NextResponse(null, { status: 200 });
}

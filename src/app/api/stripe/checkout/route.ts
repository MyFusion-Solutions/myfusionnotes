import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use Org ID if present (for B2B), else User ID
    const tenantId = orgId || userId;
    
    // Check if we have a Stripe Customer ID for this tenant already in Postgres
    // (In a real app, you'd fetch this from the 'tenants' table)
    // For MVP, if not exists, we create one.
    
    let stripeCustomerId: string | undefined;
    
    // Mock DB fetch
    // const dbTenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
    // if (dbTenant?.stripeCustomerId) stripeCustomerId = dbTenant.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.emailAddresses[0].emailAddress,
            metadata: {
                tenantId: tenantId
            }
        });
        stripeCustomerId = customer.id;
        
        // Save to DB (mock command)
        // await db.insert(tenants).values({ id: tenantId, ... }).onConflictDoUpdate(...)
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${settingsUrl}/dashboard/billing`,
      cancel_url: `${settingsUrl}/dashboard/billing`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "MyFusion Notes Pro",
              description: "Unlimited Syncs + AI Features",
            },
            unit_amount: 2900,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        tenantId: tenantId,
      },
    });

    return new NextResponse(null, {
        status: 303,
        headers: {
            Location: stripeSession.url!
        }
    })

  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

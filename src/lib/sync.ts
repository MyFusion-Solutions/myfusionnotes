'use server';

import { generateTicketSummary } from '@/lib/ai';
import { getCrmProvider } from '@/lib/integrations/crm';
import { db } from '@/lib/db';
import { integrations, syncJobs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function syncTicketToCrm(ticketData: {
  id: string,
  subject: string,
  description: string,
  requesterEmail: string
}) {
  console.log("Starting Sync for Ticket:", ticketData.id);

  // 1. Get Tenant (Auth check)
  // Note: For Zendesk sidebar, we are inside a "signed" iframe context ideally.
  // For this MVP step, we will assume the request is authenticated via the session 
  // or we pass the tenantId explicitly if we build the "signedUrl" auth flow later.
  // For now, let's try to grab auth, but if called from client side without cookie, it might fail.
  // In a real ZAF app, we decode the JWT from the search params.
  
  // MOCK: Hardcoding logic to pick the ACTIVE CRM for the user.
  // In reality, we query `integrations` for the current user's active CRM.
  // Since we are mocking the sidebar for "Verification", let's fetch the first active CRM integration in DB.
  
  // This is a simplification. In prod, we'd use the 'state' or JWT to ID the tenant.
  const activeIntegration = await db.query.integrations.findFirst({
      where: and(eq(integrations.isActive, true), eq(integrations.type, 'CRM'))
  });
  
  if (!activeIntegration) {
      return { success: false, message: "No active CRM connection found." };
  }

  // 2. Generate AI Summary
  const summary = await generateTicketSummary(`Subject: ${ticketData.subject}\n\nBody: ${ticketData.description}`);
  
  // 3. Push to CRM
  try {
      const crm = getCrmProvider(activeIntegration.provider, activeIntegration.credentials);
      const success = await crm.createNote(
          ticketData.requesterEmail, 
          `Ticket #${ticketData.id}: ${ticketData.subject}`, 
          summary
      );

      if (success) {
          // Log the job
          await db.insert(syncJobs).values({
            tenantId: activeIntegration.tenantId,
            ticketId: ticketData.id,
            status: 'SUCCESS',
            log: 'Synced via AI Sidebar',
          });
          return { success: true, summary };
      } else {
          return { success: false, message: "CRM rejected the note." };
      }

  } catch (error: any) {
      console.error("Sync failed:", error);
      return { success: false, message: error.message };
  }
}

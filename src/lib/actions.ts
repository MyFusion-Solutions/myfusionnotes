'use server'

import { db } from '@/lib/db';
import { integrations } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getIntegrations() {
  const { orgId, userId } = await auth();
  const tenantId = orgId || userId;

  if (!tenantId) {
    return [];
  }

  try {
    const data = await db.select().from(integrations).where(eq(integrations.tenantId, tenantId));
    return data;
  } catch (error) {
    console.warn('Database not configured or connection failed', error);
    return []; // Return empty on error to prevent crash if DB isn't ready
  }
}

export async function connectIntegration(
  provider: string,
  type: string,
  credentials: any,
  settings: any = {}
) {
  const { orgId, userId } = await auth();
  const tenantId = orgId || userId;

  if (!tenantId) {
    throw new Error('Unauthorized');
  }

  // Check if already exists, then update; else insert.
  // We allow one connection per provider type per tenant for simplicity v1.
  const existing = await db
    .select()
    .from(integrations)
    .where(and(eq(integrations.tenantId, tenantId), eq(integrations.provider, provider)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(integrations)
      .set({
        credentials,
        settings,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, existing[0].id));
  } else {
    await db.insert(integrations).values({
      tenantId,
      provider,
      type,
      credentials,
      settings,
      isActive: true,
    });
  }

  revalidatePath('/dashboard/connections');
  return { success: true };
}

export async function disconnectIntegration(id: string) {
  const { orgId, userId } = await auth();
  const tenantId = orgId || userId;

  if (!tenantId) {
    throw new Error('Unauthorized');
  }

  await db
    .delete(integrations)
    .where(and(eq(integrations.id, id), eq(integrations.tenantId, tenantId)));

  revalidatePath('/dashboard/connections');
  return { success: true };
}

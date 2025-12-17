'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function generateTicketSummary(ticketBody: string) {
  // Graceful handling if no API key is present during dev
  if (!process.env.OPENAI_API_KEY) {
    console.warn("Missing OPENAI_API_KEY, returning mock summary.");
    return `[MOCK SUMMARY] User reported: ${ticketBody.substring(0, 50)}... Issue resolved by resetting permissions.`;
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Summarize the following support ticket for a CRM note. 
      Focus on: 
      1. The core issue.
      2. The resolution steps.
      3. Customer sentiment (Positive/Neutral/Negative).
      
      Ticket content:
      ${ticketBody}`,
    });

    return text;
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Failed to generate summary.";
  }
}

// src/ai/flows/ai-study-assistant.ts
'use server';

/**
 * @fileOverview AI study assistant chatbot for premium users.
 *
 * - aiStudyAssistant - A function that handles the AI study assistant process.
 * - AiStudyAssistantInput - The input type for the aiStudyAssistant function.
 * - AiStudyAssistantOutput - The return type for the aiStudyAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStudyAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});

export type AiStudyAssistantInput = z.infer<typeof AiStudyAssistantInputSchema>;

const AiStudyAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI study assistant.'),
});

export type AiStudyAssistantOutput = z.infer<typeof AiStudyAssistantOutputSchema>;

export async function aiStudyAssistant(input: AiStudyAssistantInput): Promise<AiStudyAssistantOutput> {
  return aiStudyAssistantFlow(input);
}

const aiStudyAssistantPrompt = ai.definePrompt({
  name: 'aiStudyAssistantPrompt',
  input: {schema: AiStudyAssistantInputSchema},
  output: {schema: AiStudyAssistantOutputSchema},
  prompt: `You are an AI study assistant designed to help premium users with their studies.
  Your capabilities include answering questions, providing explanations and summaries of academic concepts,
  creating personalized study plans, and recommending content based on the user's progress and preferences.

  User Query: {{{query}}}

  Response:`,
});

const aiStudyAssistantFlow = ai.defineFlow(
  {
    name: 'aiStudyAssistantFlow',
    inputSchema: AiStudyAssistantInputSchema,
    outputSchema: AiStudyAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiStudyAssistantPrompt(input);
    return output!;
  }
);

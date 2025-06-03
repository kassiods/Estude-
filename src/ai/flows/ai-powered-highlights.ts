'use server';

/**
 * @fileOverview An AI agent that generates study tips for the home page.
 *
 * - generateStudyTip - A function that generates a study tip.
 * - GenerateStudyTipInput - The input type for the generateStudyTip function.
 * - GenerateStudyTipOutput - The return type for the generateStudyTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyTipInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a study tip.'),
});
export type GenerateStudyTipInput = z.infer<typeof GenerateStudyTipInputSchema>;

const GenerateStudyTipOutputSchema = z.object({
  tip: z.string().describe('The generated study tip.'),
});
export type GenerateStudyTipOutput = z.infer<typeof GenerateStudyTipOutputSchema>;

export async function generateStudyTip(input: GenerateStudyTipInput): Promise<GenerateStudyTipOutput> {
  return generateStudyTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyTipPrompt',
  input: {schema: GenerateStudyTipInputSchema},
  output: {schema: GenerateStudyTipOutputSchema},
  prompt: `You are an expert study advisor. Generate a concise and helpful study tip for the following topic: {{{topic}}}`,
});

const generateStudyTipFlow = ai.defineFlow(
  {
    name: 'generateStudyTipFlow',
    inputSchema: GenerateStudyTipInputSchema,
    outputSchema: GenerateStudyTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

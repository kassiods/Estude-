// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A flow for generating personalized course recommendations based on a user's study history.
 *
 * - getPersonalizedRecommendations - A function that retrieves personalized course recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  studyHistory: z
    .string()
    .describe(
      'A string containing the user study history, including completed courses, modules, and topics.'
    ),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences or learning goals.'),
  numberOfRecommendations: z
    .number()
    .default(3)
    .describe('The number of course recommendations to generate.'),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended course titles.'),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {
    schema: PersonalizedRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedRecommendationsOutputSchema,
  },
  prompt: `You are an AI assistant designed to provide personalized course recommendations to students based on their study history and preferences.

  Study History: {{{studyHistory}}}
  User Preferences: {{{userPreferences}}}

  Based on this information, recommend {{numberOfRecommendations}} courses that would be most relevant and helpful to the student.
  Return ONLY a JSON array of course titles. Do not include any additional information.
  Ensure the courses are distinct and cover a range of topics related to their interests.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

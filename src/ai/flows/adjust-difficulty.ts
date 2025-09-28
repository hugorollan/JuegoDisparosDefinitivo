'use server';

/**
 * @fileOverview This file contains a Genkit flow that dynamically adjusts the game difficulty based on player performance.
 *
 * adjustDifficulty - Adjusts the game difficulty based on player performance.
 * AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  score: z.number().describe('The player\'s current score.'),
  lives: z.number().describe('The number of lives the player has remaining.'),
  round: z.number().describe('The current round number.'),
  level: z.number().describe('The current difficulty level.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  newLevel: z.number().describe('The new difficulty level for the game.'),
  explanation: z.string().describe('Explanation of why the difficulty level was adjusted.'),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an expert game designer, skilled at creating engaging and balanced game experiences.

You will be provided with the player's current score, lives remaining, current round, and current difficulty level.
Your task is to determine the new difficulty level for the next round, aiming to keep the player in a state of flow and enjoyment.

Consider the following factors:
- A high score and many remaining lives indicate the game may be too easy.
- A low score and few remaining lives indicate the game may be too difficult.
- The round number indicates overall game progression.

Based on these factors, suggest a new difficulty level and provide a brief explanation for your decision.

Here's the player's current status:
- Score: {{{score}}}
- Lives: {{{lives}}}
- Round: {{{round}}}
- Level: {{{level}}}

Adjust the difficulty level and explain your reasoning. Set the newLevel field to an integer between 1 and 10.`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);

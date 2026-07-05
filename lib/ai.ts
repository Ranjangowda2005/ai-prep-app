// lib/ai.ts
// This file holds the AI prompt and settings. Keeping it separate makes it
// easy to update without touching the API route.

export function buildReviewPrompt(code: string, language: string): string {
  return `You are a senior software engineer doing a code review.

Analyse this ${language} code and provide feedback in this exact structure:

## Overall Score: [X/100]

## What is good
- List 2-3 things done well

## Bugs or Errors
- List any bugs, edge cases, or errors found
- If none, say "No bugs found"

## Improvements
- List 3-4 specific improvements with explanation

## Improved Version
\`\`\`${language}
[Rewrite the code with all improvements applied]
\`\`\`

Here is the code to review:
\`\`\`${language}
${code}
\`\`\`

Be specific, educational, and encouraging.`
}
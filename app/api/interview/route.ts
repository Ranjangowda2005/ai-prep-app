// app/api/interview/route.ts
import { streamText, type LanguageModel } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { auth } from "@clerk/nextjs/server"

const anthropic = createAnthropic()

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  const { prompt: answer, question } = await req.json()

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022") as unknown as LanguageModel,
    prompt: `You are an expert technical interviewer evaluating a candidate's response.

Interview Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate the answer and respond in this EXACT format:

## Score: [X/10]

## What worked well
[2-3 specific things done well in this answer]

## What to improve
[2-3 specific improvements with examples]

## Example stronger answer
[Write a model answer using the STAR format: Situation, Task, Action, Result]

## One-line tip
[Give one actionable tip for next time]

Be encouraging but honest. Focus on helping them improve.`,
  })

  return result.toTextStreamResponse()
}
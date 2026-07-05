// app/api/review/route.ts
// This is the backend. When the frontend calls POST /api/review,
// this function runs on the server and streams back AI feedback.

import { streamText } from "ai"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { buildReviewPrompt } from "@/lib/ai"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    // Step 1: Check the user is logged in
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Step 2: Get the code and language from the request body
    const { code, language } = await req.json()

    // Step 3: Validate inputs — make sure code is not empty
    if (!code || code.trim().length === 0) {
      return new Response("Code is required", { status: 400 })
    }

    // Step 4: Check usage limit for free users (max 5 reviews per month)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (user && user.plan === "free" && user.usageCount >= 5) {
      return new Response("Usage limit reached. Upgrade to Pro.", { status: 403 })
    }

    // Step 5: Call Claude AI and stream the response back
    const result = await streamText({
      model: "claude-haiku-4-5",  // Fast and cheap model
      prompt: buildReviewPrompt(code, language),
      onFinish: async ({ text }) => {
        // Step 6: After AI finishes, save the review to the database
        if (user) {
          await prisma.review.create({
            data: {
              userId: user.id,
              language,
              code,
              feedback: text,
              score: extractScore(text),  // Parse the score from AI response
            }
          })
          // Increment usage count
          await prisma.user.update({
            where: { id: user.id },
            data: { usageCount: { increment: 1 } }
          })
        }
      }
    })

    // Step 7: Return the streaming response to the browser
    return result.toTextStreamResponse()

  } catch (error) {
    console.error("Review API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

function extractScore(text: string): number {
  const match = text.match(/Overall Score:\s*(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}
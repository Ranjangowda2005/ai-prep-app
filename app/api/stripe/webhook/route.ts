// app/api/stripe/webhook/route.ts
// Stripe calls THIS endpoint after a payment succeeds.
// This is how your app knows someone actually paid.

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const body      = await req.text()
  const signature = (await headers()).get("stripe-signature")!

  let event

  try {
    // Verify the webhook is really from Stripe (not a fake request)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Webhook signature failed", { status: 400 })
  }

  // Handle the "payment succeeded, subscription created" event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const userId  = session.metadata?.userId

    if (userId) {
      // Upgrade the user's plan to "pro" in our database
      await prisma.user.update({
        where: { id: userId },
        data:  { plan: "pro" }
      })

      // Save subscription details
      await prisma.subscription.upsert({
        where:  { userId },
        update: { status: "active", stripeCustomerId: session.customer as string },
        create: {
          userId,
          stripeCustomerId:  session.customer as string,
          stripePriceId:     "price_YOUR_PRICE_ID_HERE",
          status:            "active",
          currentPeriodEnd:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      })
    }
  }

  return new Response("OK", { status: 200 })
}
// app/api/stripe/checkout/route.ts
// When the user clicks "Upgrade to Pro", this creates a Stripe Checkout session
// and sends them to Stripe's payment page

import { stripe } from "@/lib/stripe"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  // Find the user in our database
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return new Response("User not found", { status: 404 })

  // Create a Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",                         // This is a recurring subscription
    payment_method_types: ["card"],
    line_items: [{
      price: "price_YOUR_PRICE_ID_HERE",          // ← Paste your Price ID from Stripe dashboard
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    metadata: { userId: user.id },                // Attach our user ID so webhook knows who paid
  })

  // Send the checkout URL back to the frontend
  return Response.json({ url: session.url })
}
// app/dashboard/page.tsx
// No "use client" here — this is a SERVER component.
// Server components fetch data before the page loads. Faster and more secure.

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/prisma/lib/prisma"

export default async function DashboardPage() {
  // Get logged-in user's Clerk ID
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")  // If not logged in, send to login page

  // Get user from OUR database (not Clerk) with all their reviews
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },  // Newest reviews first
        take: 10,                         // Only get last 10 reviews
      }
    }
  })

  // First time this user visits: create their record in our database
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: "",      // You can get email from Clerk's currentUser() if needed
        name: "User",
      },
      include: { reviews: true }
    })
  }

  

  // Calculate stats from the reviews array
  const totalReviews = user.reviews.length
  const avgScore = totalReviews > 0
    ? Math.round(user.reviews.reduce((sum, r) => sum + r.score, 0) / totalReviews)
    : 0
  const remainingFree = user.plan === "free" ? Math.max(0, 5 - user.usageCount) : 999

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Link href="/review">
          <Button>New Code Review</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold">{totalReviews}</p>
          <p className="text-sm text-muted-foreground">Total Reviews</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold">{avgScore}</p>
          <p className="text-sm text-muted-foreground">Average Score</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold">{remainingFree}</p>
          <p className="text-sm text-muted-foreground">
            {user.plan === "free" ? "Free Reviews Left" : "Unlimited (Pro)"}
          </p>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent Reviews</h2>
      {user.reviews.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No reviews yet. <Link href="/review" className="underline">Do your first one!</Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {user.reviews.map((review) => (
            <Card key={review.id} className="p-4 flex items-center justify-between">
              <div>
                <Badge variant="outline">{review.language}</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{review.score}</p>
                <p className="text-xs text-muted-foreground">score</p>
              </div>
            </Card>
          ))}
          {user.plan === "free" && (
            <Card className="p-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950 mb-6">
              <p className="font-medium">You are on the Free plan</p>
              <p className="text-sm text-muted-foreground">
                {5 - user.usageCount} reviews remaining this month. Upgrade for unlimited.
              </p>
              <UpgradeButton />
            </Card>
          )}
        </div>
      )}
    </div>
  )
  
}

"use client"

function UpgradeButton() {
  async function handleUpgrade() {
    // Call our checkout API which returns a Stripe payment URL
    const res  = await fetch("/api/stripe/checkout", { method: "POST" })
    const data = await res.json()
    if (data.url) window.location.href = data.url  // Redirect to Stripe payment page
  }

  return (
    <button
      onClick={handleUpgrade}
      className="w-full mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
    >
      ⚡ Upgrade to Pro — $9/month
    </button>
  )
}

// app/page.tsx
// This is a SERVER component — no "use client" needed
// It is the homepage at http://localhost:3000

import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function HomePage() {
  const { userId } = await auth()
  // If user is already logged in, show "Go to Dashboard" instead of "Get Started"
  const isLoggedIn = !!userId

  return (
    <div className="max-w-5xl mx-auto">

      {/* ====== HERO SECTION ====== */}
      <section className="text-center py-20">
        <Badge className="mb-4">Powered by Claude AI</Badge>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Ace your next <span className="text-primary">tech interview</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get instant AI feedback on your code quality and interview answers.
          Practice daily and track your improvement with real scores.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 justify-center">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard →</Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Free forever · 5 reviews/month · No credit card needed
        </p>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Everything you need to prepare
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🤖",
              title: "AI Code Review",
              desc: "Paste any code and get instant feedback on bugs, style, complexity, and improvements with a quality score."
            },
            {
              icon: "🎯",
              title: "Mock Interviews",
              desc: "Practice behavioral questions with AI. Get scored on your STAR format, clarity, and confidence."
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              desc: "See your scores improve over time. Identify weak areas and track which languages you've practiced."
            }
          ].map((f) => (
            <Card key={f.title} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ====== PRICING SECTION ====== */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free Plan */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-1">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              {["5 code reviews per month","3 mock interviews per month","Score history","Basic feedback"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span>✅</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">Get Started Free</Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 border-primary relative overflow-hidden">
            <Badge className="absolute top-4 right-4">Popular</Badge>
            <h3 className="text-lg font-semibold mb-1">Pro</h3>
            <p className="text-3xl font-bold mb-4">$9<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              {["Unlimited code reviews","Unlimited mock interviews","Detailed AI explanations","Priority response speed","Cancel anytime"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span>✅</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up">
              <Button className="w-full">Start Pro Free Trial</Button>
            </Link>
          </Card>
        </div>
      </section>

    </div>
  )
}
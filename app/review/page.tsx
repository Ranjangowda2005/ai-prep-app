// app/review/page.tsx
// "use client" because this page has buttons, inputs, and live state
"use client"

import { useState } from "react"
// Removed dependency on 'ai/react' which may not be installed.
// Use built-in fetch streaming to call our /api/review endpoint.
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Language options for the dropdown
const LANGUAGES = ["JavaScript","TypeScript","Python","Java","C++","Go","Rust","PHP"]

export default function ReviewPage() {
  const [code, setCode] = useState("")                    // User's typed code
  const [language, setLanguage] = useState("JavaScript")  // Selected language

  // useCompletion handles calling the API and streaming the response
  // complete() triggers the API call
  // completion holds the streamed text so far
  // isLoading is true while AI is responding
  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Call our backend streaming route and update completion as chunks arrive
  async function handleReview() {
    if (!code.trim()) return
    setCompletion("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunk = decoder.decode(value)
          setCompletion((prev) => prev + chunk)
        }
      }
    } catch (err) {
      setCompletion((prev) => prev + "\n\n[Error fetching review]")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">AI Code Review</h1>
      <p className="text-muted-foreground mb-6">
        Paste your code below and get instant AI feedback
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <Card className="p-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-80 font-mono text-sm border rounded-md p-3 resize-none"
            />

            <Button
              onClick={handleReview}
              disabled={isLoading || !code.trim()}
              className="w-full mt-3"
            >
              {isLoading ? "Reviewing..." : "Review My Code"}
            </Button>
          </Card>
        </div>

        <Card className="p-4">
          {completion ? (
            // Show the streaming AI response
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {completion}
                {isLoading && <span className="animate-pulse">▋</span>}
              </pre>
            </div>
          ) : (
            // Show placeholder when no review yet
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-4xl mb-3">🤖</p>
                <p>Your AI feedback will appear here</p>
                <p className="text-xs mt-1">Results stream in real-time</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
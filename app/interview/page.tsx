"use client"

import { useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// A bank of real interview questions — user picks one
const QUESTIONS = [
  { category: "Behavioral", q: "Tell me about a time you had to debug a very difficult bug. How did you approach it?" },
  { category: "Behavioral", q: "Describe a project you are most proud of and explain your specific contribution." },
  { category: "Behavioral", q: "Tell me about a time you disagreed with a teammate. How did you handle it?" },
  { category: "Behavioral", q: "How do you handle working under pressure with tight deadlines?" },
  { category: "Technical",  q: "Explain how you would design a URL shortener like bit.ly." },
  { category: "Technical",  q: "Walk me through how you would optimize a slow database query." },
  { category: "Technical",  q: "How would you design a notification system that sends emails and push notifications?" },
]

export default function InterviewPage() {
  const [selectedQ, setSelectedQ]   = useState(QUESTIONS[0])
  const [userAnswer, setUserAnswer] = useState("")
  const [submitted, setSubmitted]   = useState(false)

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/interview",
  })

  async function handleSubmit() {
    if (!userAnswer.trim()) return
    setSubmitted(true)
    await complete("", {
      body: { question: selectedQ.q, answer: userAnswer }
    })
  }

  function handleNewQuestion() {
    // Pick a random question that is not the current one
    const others = QUESTIONS.filter(q => q.q !== selectedQ.q)
    setSelectedQ(others[Math.floor(Math.random() * others.length)])
    setUserAnswer("")
    setSubmitted(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Mock Interview Practice</h1>
      <p className="text-muted-foreground mb-6">
        Answer the question below. AI will score and coach you.
      </p>

      {/* Question Card */}
      <Card className="p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">{selectedQ.category}</Badge>
            <p className="font-medium text-base">{selectedQ.q}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNewQuestion}>
            New Question ↺
          </Button>
        </div>
      </Card>

      {/* Answer Area */}
      {!submitted ? (
        <div className="space-y-3">
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here. Take your time — aim for 2-4 paragraphs using the STAR format (Situation, Task, Action, Result)."
            className="h-48 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {userAnswer.length} characters · Aim for 200+ for a strong answer
            </span>
            <Button onClick={handleSubmit} disabled={userAnswer.length < 50}>
              Submit for AI Scoring →
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show user's answer */}
          <Card className="p-4 bg-muted">
            <p className="text-xs font-medium text-muted-foreground mb-1">YOUR ANSWER</p>
            <p className="text-sm">{userAnswer}</p>
          </Card>

          {/* Show AI feedback streaming in */}
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">AI FEEDBACK</p>
            {isLoading && !completion && (
              <p className="text-sm text-muted-foreground animate-pulse">Analysing your answer...</p>
            )}
            <pre className="text-sm whitespace-pre-wrap font-sans">
              {completion}
              {isLoading && <span className="animate-pulse">▋</span>}
            </pre>
          </Card>

          {/* Try again button */}
          {!isLoading && completion && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setSubmitted(false); setUserAnswer("") }}>
                Retry this question
              </Button>
              <Button onClick={handleNewQuestion}>
                Next question →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
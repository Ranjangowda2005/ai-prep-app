// app/error.tsx
// Next.js shows this automatically if any page throws an error.
// Without this, users see a white screen with no message.
"use client"  // Must be a client component

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error, reset
}: {
  error: Error
  reset: () => void   // Calling reset() tries to re-render the page
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-4xl">⚠️</p>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
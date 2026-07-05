// components/Navbar.tsx
// "use client" means this component runs in the browser (not on the server)
// We need it because Clerk's buttons need browser interactivity
"use client"

import Link from "next/link"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"

export default function Navbar() {
  const { isSignedIn } = useUser()  // Hook — gives us whether user is logged in

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between">
      
      <Link href="/" className="text-lg font-semibold">
        AI Prep
      </Link>

      
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          // If logged in: show dashboard link and user avatar/logout button
          <>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link href="/review" className="text-sm text-muted-foreground hover:text-primary">
              Code Review
            </Link>
            <UserButton />
          </>
        ) : (
          // If not logged in: show Sign In button
          <SignInButton mode="modal">
            <button className="text-sm font-medium">Sign In</button>
          </SignInButton>
        )}
      </div>
    </nav>
  )
}
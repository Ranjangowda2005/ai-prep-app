// middleware.ts
// This file runs on EVERY page load before anything else.
// It checks if the user is logged in before letting them see protected pages.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// These are the routes that REQUIRE login
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // /dashboard and everything under it
  "/review(.*)",
  "/interview(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If the user tries to visit a protected route without being logged in...
  if (isProtectedRoute(req)) {
    await auth.protect(); // ...redirect them to the login page automatically
  }
});

// This tells Next.js which requests this middleware should run on
export const config = {
  matcher: [
    // Run middleware for most pages/APIs
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

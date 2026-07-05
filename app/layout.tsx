import { ClerkProvider } from "@clerk/nextjs"; // Import the Clerk wrapper
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Add this import at the top

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Interview Prep",
  description: "Practice coding and interviews with AI feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ClerkProvider wraps everything — gives every page access to user info
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar /> 
          <main className="container mx-auto px-4 py-8">
            {children} 
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

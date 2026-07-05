// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
// (Next.js hot-reloads modules, which would otherwise create a new
// PrismaClient — and a new DB connection — on every save)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
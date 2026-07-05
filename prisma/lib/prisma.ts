// lib/prisma.ts
// This file creates ONE shared database connection for the whole app.

import { PrismaClient } from "@prisma/client";

// Store the client on the global object to avoid creating too many connections
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Shows database queries in the terminal while developing
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

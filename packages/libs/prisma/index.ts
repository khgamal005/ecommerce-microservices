import { PrismaClient } from '@prisma/client';

// Fix the global type declaration
declare global {
  var prismadb: PrismaClient | undefined;
}

// Pass an empty options object to prevent the '__internal' error
const prisma = globalThis.prismadb || new PrismaClient({});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismadb = prisma;
}

export default prisma;
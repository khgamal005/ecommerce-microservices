import { defineConfig } from "@prisma/config";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

export default defineConfig({
  // Path to your schema file
  schema: "../../../prisma/schema.prisma",

  // Required datasource configuration
  datasource: {
    url: process.env.DATABASE_URL, // must be a string
  },
});

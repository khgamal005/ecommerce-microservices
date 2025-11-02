import 'dotenv/config'; // ✅ Load .env at the very top
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';

const prisma = new PrismaClient(); // ✅ Initialize Prisma client

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// ------------------------
// Routes
// ------------------------
app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Example: get all users from MongoDB
app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err); // Pass to error middleware
  }
});

app.use(errorMiddleware);

// ------------------------
// Start Server
// ------------------------
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}/api`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// ------------------------
// Optional: Graceful shutdown
// ------------------------
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

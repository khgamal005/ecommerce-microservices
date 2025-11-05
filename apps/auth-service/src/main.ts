import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { errorMiddleware } from '@packages/error-handler/error-middleware';
const swaggerDocument = require('./swagger-output.json');
import router from './routes/auth.router';

const app = express();

// =======================
// 🔧 Middleware
// =======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// =======================
// 🧭 Routes
// =======================
app.use('/api', router);

// =======================
// 📘 Swagger Docs
// =======================
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (_, res) => res.json(swaggerDocument));

console.log('✅ Swagger loaded successfully.');

// =======================
// 🏠 Root & Error Middleware
// =======================
app.get('/', (_, res) => res.send({ message: 'Hello API' }));
app.use(errorMiddleware);

// =======================
// 🚀 Start Server
// =======================
const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.PORT) || 6001;

const server = app.listen(port, host, () => {
  console.log(`[ Auth Service running on ] http://${host}:${port}/api`);
});

server.on('error', (err) => console.error('Server error:', err));

// =======================
// 🧹 Graceful Shutdown
// =======================
process.on('SIGINT', () => {
  console.log('Shutting down auth-service...');
  server.close(() => process.exit(0));
});

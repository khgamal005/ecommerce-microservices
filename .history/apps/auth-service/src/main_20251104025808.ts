import 'dotenv/config'; // ✅ load .env first
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../..';
import router from './routes/auth.router';

// console.log('DATABASE_URL:', process.env.DATABASE_URL); // ✅ log DB URL for debug


const app = express();

// ------------------------
// Middleware
// ------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// ------------------------
// Routes
app.use('/api', router);

// ------------------------
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req, res) => {
  res.json(swaggerDocument);
});
app.get('/', (req, res) => res.send({ message: 'Hello API' }));



app.use(errorMiddleware);

// ------------------------
// Start Server
// ------------------------
const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.PORT) || 6001;

const server = app.listen(port, host, () =>
  console.log(`[ auth  services is  running on  ] http://${host}:${port}/api`)
);

server.on('error', (err) => console.error('Server error:', err));

// ------------------------
// Graceful shutdown
// ------------------------
process.on('SIGINT', async () => {
  console.log('Shutting down auth-service...');
  server.close(() => process.exit(0));
});

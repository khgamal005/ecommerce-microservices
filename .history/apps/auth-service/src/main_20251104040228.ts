import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import swaggerUi from 'swagger-ui-express';
import router from './routes/auth.router';
import path from 'path';
import fs from 'fs';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', router);

// Swagger Documentation
try {
  // Try multiple possible locations
  const possiblePaths = [
    path.join(__dirname, 'swagger-output.json'), // dist folder
    path.join(__dirname, 'src', 'swagger-output.json'), // src in dist
    path.join(process.cwd(), 'apps', 'auth-service', 'src', 'swagger-output.json'), // source
  ];

  let swaggerPath = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      swaggerPath = possiblePath;
      break;
    }
  }

  if (swaggerPath) {
    const swaggerDocument = require(swaggerPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.get('/docs-json', (req, res) => {
      res.json(swaggerDocument);
    });
    console.log('✅ Swagger documentation loaded from:', swaggerPath);
  } else {
    console.warn('⚠️ Swagger documentation not found in any location');
    console.warn('   Run: cp apps/auth-service/src/swagger-output.json apps/auth-service/dist/');
  }
} catch (error: any) {
  console.warn('⚠️ Failed to load Swagger documentation:', error?.message || error);
}

app.get('/', (req, res) => res.send({ message: 'Hello API' }));
app.use(errorMiddleware);

// Start Server
const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.PORT) || 6001;

const server = app.listen(port, host, () =>
  console.log(`[ auth service is running on ] http://${host}:${port}/api`)
);

server.on('error', (err) => console.error('Server error:', err));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down auth-service...');
  server.close(() => process.exit(0));
});
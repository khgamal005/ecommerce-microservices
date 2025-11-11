import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health route
app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome gateway' });
});

// ✅ Proxy all /api requests to auth-service (without duplicating /api)
// In your api-gateway main.ts
// app.use(
//   '/api',
//   proxy(`http://localhost:${process.env.PORT || 6001}`, {
//     parseReqBody: true,
//     proxyReqPathResolver: (req) => {
//       console.log(`[GATEWAY] Proxying: ${req.method} ${req.url} -> http://localhost:6001${req.url}`);
//       return req.url; // This removes the /api prefix when forwarding
//     },
//     proxyReqOptDecorator: (opts, srcReq) => {
//       console.log(`[GATEWAY] Headers:`, srcReq.headers);
//       return opts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       console.log(`[GATEWAY] Response from auth service: ${proxyRes.statusCode}`);
//       return proxyResData;
//     }
//   })
// );
app.use('/',proxy('http://localhost:6001'))

// Start server
const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.GATEWAY_PORT) || 8080;

app.listen(port, host, () =>
  console.log(`[ ready ] http://${host}:${port}/api`)
);

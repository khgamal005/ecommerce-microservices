import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import initializeSiteConfig from './libs/initializeSiteConfig';

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // This is crucial for cookies
  })
);

// Handle preflight requests
app.options('*', cors());
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
app.use('/product',proxy('http://localhost:6002'))

// Start server
const host = process.env.HOST ?? 'localhost';
const port = Number(process.env.GATEWAY_PORT) || 8080;


const server =app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}/api`)
  try {
    initializeSiteConfig();
    console.log(`[ site config initialized successfully ]`);
  }
  catch (error) {
    console.error('Error creating site config:', error);
  }
});
server.on('error',console.error);

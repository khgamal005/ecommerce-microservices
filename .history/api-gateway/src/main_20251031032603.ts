import express = require('express');


import cookieParser = require('cookie-parser');
import path = require('path');
import morgan = require('morgan');
import proxy = require('express-http-proxy');
import cors = require('cors');
import rateLimit from 'express-rate-limit';
import swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.static(path.join(__dirname, 'assets')));



app.use(cookieParser());
app.use(cors());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(morgan("dev"));
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: any) => {
    return req.ip;
  },
});

app.use(limiter);
app.use('/', proxy('http://localhost:6001'));



app.get('/getway-health', (req, res) => {
  res.send({ message: 'welcame getway' });
});

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}/api`);
});

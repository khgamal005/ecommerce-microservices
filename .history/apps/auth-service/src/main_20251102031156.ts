import express from 'express';
import cors from "cors";
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';

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


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
app.use(errorMiddleware);

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

// ✅ store the returned server instance
const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}/api`);
});

// ✅ attach error handler to the server
server.on('error', (err) => {
  console.error('Server error:', err);
});

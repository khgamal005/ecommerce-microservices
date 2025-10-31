import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";
import proxy from "express-http-proxy";
import cors from "cors";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);

app.use(express.static(path.join(__dirname, "assets")));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));

onst limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator, // ✅ use helper
});
app.use(limiter);
app.use(limiter);

// proxy to backend
app.use("/", proxy("http://localhost:6001"));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome gateway" });
});

const host = process.env.HOST ?? "localhost";
const port = Number(process.env.PORT) || 8080;

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}/`);
});

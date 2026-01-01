import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import locationRoutes from "./routes/location.route.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

//Global error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import locationRoutes from "./routes/location.route.js";
import nookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/booking", nookingRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

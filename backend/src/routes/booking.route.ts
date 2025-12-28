import express from "express";
import {
  checkAvailibility,
  createBooking,
  deleteBooking,
  getUserBookings,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check-available/:id", checkAvailibility);
router.get("/user-booking", protectRoute, getUserBookings);

router.post("/create/:id", protectRoute, createBooking);

router.delete("/:id", protectRoute, deleteBooking);

export default router;

import { Request, Response } from "express";
import action from "../lib/handler/action.js";
import {
  CreateBookingSchema,
  DeleteBookingSchema,
  GetAvailabilitySchema,
  GetUserBookingsSchema,
} from "../lib/validation.js";
import handleError from "../lib/handler/error.js";
import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/http-error.js";

export async function createBooking(req: Request, res: Response) {
  const body = req.body;
  const { id } = req.params;

  const params = {
    ...body,
    locationId: id,
  };

  const validationResult = await action({
    params,
    schema: CreateBookingSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { numOfPeople, bookingDate, totalPrice, remarks, locationId } =
    validationResult.params!;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      //1.Find limit booking for this location
      const location = await tx.location.findUnique({
        where: { id: locationId },
        select: { limitBooking: true, name: true },
      });

      if (!location) throw new NotFoundError("Location");

      //2.Check the number of people booking on this date
      const existingBookingCount = await tx.booking.aggregate({
        where: {
          locationId: locationId,
          bookingDate: new Date(bookingDate),
        },
        _sum: { numOfPeople: true },
      });
      const currentTotal = existingBookingCount._sum.numOfPeople || 0;

      //3.Check if number of people more than the limit
      if (currentTotal + numOfPeople > location.limitBooking) {
        throw new Error(
          `Sorry, this location is full for the selected date. (Available: ${
            location.limitBooking - currentTotal
          })`
        );
      }

      //4. Create a new booking
      const newBooking = await tx.booking.create({
        data: {
          numOfPeople,
          bookingDate: new Date(bookingDate),
          totalPrice,
          remarks,
          locationId,
          userId,
        },
      });

      return newBooking;
    });

    return res.status(201).json({
      success: true,
      data: {
        booking: result,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteBooking(req: Request, res: Response) {
  const { id } = req.params;

  const params = {
    bookingId: id,
  };

  const validationResult = await action({
    params,
    schema: DeleteBookingSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { bookingId } = validationResult.params!;
  const userId = req.user.id;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundError("Booking");

    const isAuthorized = userId === booking.userId;
    if (!isAuthorized)
      throw new Error("Unauthorzed - you cannot delete this booking");

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function checkAvailibility(req: Request, res: Response) {
  const { id } = req.params;
  const { date: queryDate } = req.query;

  const params = {
    locationId: id,
    date: typeof queryDate === "string" ? queryDate : undefined,
  };

  const validationResult = await action({
    params,
    schema: GetAvailabilitySchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { locationId, date } = validationResult.params!;

  try {
    const [location, existingBooking] = await Promise.all([
      prisma.location.findUnique({
        where: { id: locationId },
        select: { limitBooking: true },
      }),
      prisma.booking.aggregate({
        where: {
          locationId,
          bookingDate: new Date(date),
        },
        _sum: { numOfPeople: true },
      }),
    ]);
    if (!location) throw new NotFoundError("Location");

    const bookedCount = existingBooking._sum.numOfPeople || 0;
    const availableNumber = Math.max(0, location.limitBooking - bookedCount);
    const isFull = availableNumber <= 0;

    return res.status(200).json({
      success: true,
      data: {
        locationId,
        available: availableNumber,
        date,
        isFull,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getUserBookings(req: Request, res: Response) {
  const loggedInUserId = req.user.id;

  const params = {
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    query: typeof req.query.query === "string" ? req.query.query : undefined,
    filter: req.query.filter as string | undefined,
    userId: loggedInUserId,
  };

  const validationResult = await action({
    params,
    schema: GetUserBookingsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { userId, filter, page, pageSize, query } = validationResult.params!;

  const skip = (page - 1) * pageSize;

  const sortCriteria: any =
    filter === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  try {
    const whereClause: any = {
      userId,
      location: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    };

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: sortCriteria,
        select: {
          id: true,
          bookingDate: true,
          numOfPeople: true,
          location: {
            select: {
              name: true,
              subdistrict: true,
              district: true,
              province: true,
              typeName: true,
            },
          },
        },
      }),

      prisma.booking.count({ where: whereClause }),
    ]);

    const isNext = totalCount > skip + bookings.length;

    return res.status(200).json({
      success: true,
      data: {
        bookings,
        totalCount,
        isNext,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

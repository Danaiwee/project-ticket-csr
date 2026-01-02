import { Request, Response } from "express";
import action from "../lib/handler/action.js";
import {
  GetLocationDateSchema,
  UpdateDateLimitSchema,
} from "../lib/validation.js";
import handleError from "../lib/handler/error.js";
import { prisma } from "../lib/prisma.js";

export async function getLocationDateBookings(req: Request, res: Response) {
  const { id } = req.params;

  const params = {
    locationId: id,
    date: typeof req.query.date === "string" ? req.query.date : undefined,
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 10,
    query: typeof req.query.query === "string" ? req.query.query : undefined,
    filter: req.query.filter as string | undefined,
  };

  const validationResult = await action({
    params,
    schema: GetLocationDateSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { locationId, date, page, pageSize, filter } = validationResult.params!;

  const sortCriteria: any =
    filter === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  const skip = (page - 1) * pageSize;

  try {
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: {
          locationId,
          bookingDate: new Date(date),
        },
        skip,
        take: pageSize,
        orderBy: sortCriteria,
        select: {
          id: true,
          bookingDate: true,
          numOfPeople: true,
          totalPrice: true,
          location: {
            select: {
              name: true,
              subdistrict: true,
              district: true,
              province: true,
              typeName: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.booking.count({
        where: { locationId, bookingDate: new Date(date) },
      }),
    ]);

    const isNext = totalCount > skip + bookings.length;

    return res.status(200).json({
      success: true,
      data: {
        bookings,
        isNext,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateLocationLimit(req: Request, res: Response) {
  const { id } = req.params;
  const { limitBooking } = req.body;

  const params = { locationId: id, limitBooking: Number(limitBooking) };

  const validationResult = await action({
    params,
    schema: UpdateDateLimitSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult, res);

  const { limitBooking: newLimit, locationId } = validationResult.params!;

  try {
    const maxinumBooking = await prisma.booking.groupBy({
      by: ["bookingDate"],
      where: {
        locationId,
        bookingDate: { gte: new Date() },
      },
      _sum: { numOfPeople: true },
      orderBy: { _sum: { numOfPeople: "desc" } },
      take: 1,
    });

    const maxCurrentBookings = maxinumBooking[0]?._sum.numOfPeople || 0;

    if (newLimit < maxCurrentBookings) {
      throw new Error(
        `Cannot reduce limit to ${newLimit}. One of your upcoming dates already has ${maxCurrentBookings} bookings.`
      );
    }

    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: { limitBooking: newLimit },
    });

    return res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    return handleError(error, res);
  }
}

/*Example data of maxinumBooking
  [
  {
    "bookingDate": "2026-01-01T00:00:00.000Z",
    "_sum": {
      "numOfPeople": 9
    }
  }
]
*/

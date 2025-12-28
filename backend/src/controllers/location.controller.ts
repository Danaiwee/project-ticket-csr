import { Request, Response } from "express";
import action from "../lib/handler/action.js";
import { GetLocationSchema, PaginatedSearchSchema } from "../lib/validation.js";
import handleError from "../lib/handler/error.js";
import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/http-error.js";

export async function getLocations(req: Request, res: Response) {
  const params = {
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    query: typeof req.query.query === "string" ? req.query.query : undefined,
  };

  const validationResults = await action({
    params,
    schema: PaginatedSearchSchema,
  });

  if (validationResults instanceof Error) {
    return handleError(validationResults, res);
  }

  const { page, pageSize, query } = validationResults.params!;

  const skip = (page - 1) * pageSize;

  try {
    const whereClause = {
      name: {
        contains: query,
        mode: "insensitive" as const, //ignore case insensitive
      },
    };

    const totalCount = await prisma.location.count({ where: whereClause });

    const locations = await prisma.location.findMany({
      where: whereClause,
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        item: true,
        name: true,
        typeName: true,
        subdistrict: true,
        district: true,
        province: true,
        region: true,
      },
    });

    const isNext = totalCount > skip + locations.length;

    return res.status(200).json({
      success: true,
      data: {
        locations,
        isNext,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getLocation(req: Request, res: Response) {
  const { id } = req.params;

  const params = {
    locationId: id,
  };

  const validationResults = await action({
    params,
    schema: GetLocationSchema,
  });

  if (validationResults instanceof Error) {
    return handleError(validationResults, res);
  }

  const { locationId } = validationResults.params!;

  try {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) throw new NotFoundError("Location");

    return res.status(200).json({
      success: true,
      data: {
        location,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
}

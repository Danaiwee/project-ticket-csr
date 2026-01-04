import { Response } from "express";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-error.js";
import logger from "../logger.js";

const sendErrorResponse = (
  res: Response,
  status: number,
  message: string,
  errors?: Record<string, string[]>
) => {
  const responseBody: ErrorResponse = {
    success: false,
    error: {
      message,
      details: errors,
    },
    status,
  };

  return res.status(status).json(responseBody);
};

const handleError = (error: unknown, res: Response) => {
  if (error instanceof RequestError) {
    logger.error({ err: error }, `API Error: ${error.message}`);

    return sendErrorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`
    );

    return sendErrorResponse(
      res,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);
    // กรณี Error ทั่วไปมักเป็น Internal Server Error (500)
    return sendErrorResponse(res, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return sendErrorResponse(res, 500, "An unexpected error occurred");
};

export default handleError;


/*Raw Zod Error object example
  [
  {
    "code": "too_small",
    "minimum": 6,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "Password must be at least 6 characters long.",
    "path": ["password"]
  },
  {
    "code": "invalid_string",
    "validation": "email",
    "message": "Please provide a valid email address.",
    "path": ["email"]
  }
]

after flattern
{
  formErrors: [], // Error ที่เกิดกับทั้งฟอร์ม (ไม่ได้ระบุฟิลด์)
  fieldErrors: {  // <--- นี่คือสิ่งที่คุณดึงไปใช้!
    password: ["Password must be at least 6 characters long."],
    email: ["Please provide a valid email address."]
  }
}
*/
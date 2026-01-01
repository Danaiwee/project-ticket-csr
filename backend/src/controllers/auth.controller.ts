import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import action from "../lib/handler/action.js";
import { SignInSchema, SignUpSchema } from "../lib/validation.js";
import handleError from "../lib/handler/error.js";
import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/http-error.js";

export async function signup(req: Request, res: Response) {
  const body = req.body;

  const validationResult = await action({
    params: body,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { firstName, lastName, email, password } = validationResult.params!;

  try {
    const isExistingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (isExistingEmail) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: { id: true },
    });
    if (!newUser) throw new Error("Failed to create new user");

    await generateTokenAndSetCookie(newUser.id.toString(), res);

    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function signIn(req: Request, res: Response) {
  const body = req.body;

  const validationResult = await action({
    params: body,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, res);
  }

  const { email, password } = validationResult.params!;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    await generateTokenAndSetCookie(user.id.toString(), res);

    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getLoggedInUser(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) throw new NotFoundError("User");

    return res.status(200).json(user);
  } catch (error) {
    return handleError(error, res);
  }
}

async function generateTokenAndSetCookie(userId: String, res: Response) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
}

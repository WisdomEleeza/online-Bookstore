import { Request, Response, NextFunction } from "express";
import token from "../utils/token"; // Assuming token is an object with types
import HttpException from "../utils/http.exception";
import { JsonWebTokenError } from "jsonwebtoken"; // Import JsonWebTokenError from jsonwebtoken
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorized"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payload = token.verifyToken(accessToken);

    if (payload instanceof JsonWebTokenError) {
      // console.log("Unauthorized: Token verification failed");
      return next(new HttpException(401, "Unauthorized"));
    }

    // Check if payload is not undefined and has the expected structure
    if (payload && typeof payload === "object" && "id" in payload) {
      const userId = payload.id;
      // console.log("Fetching user from database for user id:", userId);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // console.log("user", user);

      if (!user) return next(new HttpException(401, "Unauthorized"));
      // console.log("Unauthorized: User not found in the database");

      // console.log("User found. Proceeding to the next middleware");
      return next();
    } else {
      // console.log(
      //   "Unauthorized: Token payload does not have the expected structure",
      // );
      return next(new HttpException(401, "Unauthorized"));
    }
  } catch (error) {
    // console.error("Token verification error", error);
    return next(new HttpException(401, "Unauthorized"));
  }
}

export default authenticatedMiddleware;

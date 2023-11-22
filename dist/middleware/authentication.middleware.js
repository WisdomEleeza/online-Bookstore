"use strict";
// import { Request, Response, NextFunction } from "express";
// import * as token from "@/utils/token"; // Assuming token is an object with types
// import HttpException from "@/utils/http.exception";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// async function authenticatedMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<Response | void> {
//   const bearer = req.headers.authorization;
//   if (!bearer || !bearer.startsWith("Bearer ")) {
//     return next(new HttpException(401, "Unauthorized"));
//   }
//   const accessToken = bearer.split("Bearer ")[1].trim();
//   try {
//     const payload = token.verifyToken(accessToken);
//     if (payload instanceof jwt.JsonWebTokenError) {
//       return next(new HttpException(401, "Unauthorized"));
//     }
//     const user = await prisma.user.findUnique({
//       where: { id: payload.id },
//       select: { password: false },
//     });
//     if (!user) return next(new HttpException(401, "Unauthorized"));
//     // req.user = user;
//     return next();
//   } catch (error) {
//     return next(new HttpException(401, "Unauthorized"));
//   }
// }
// export default authenticatedMiddleware;

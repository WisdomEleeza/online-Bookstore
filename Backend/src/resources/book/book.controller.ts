import { Request, Response, NextFunction, Router } from "express";
import HttpException from "@/utils/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validateBook from "@/resources/book/book.validate";
import BookService from "./book.service";
// import { PrismaClient } from "@prisma/client";

class BookController {
  private router = Router();
  private BookService = BookService;
  //   private prisma = new PrismaClient()

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      "/books/create-book",
      validationMiddleware(validateBook.BookValidation),
    );
  }

  private PostBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {};
}

export default BookController;

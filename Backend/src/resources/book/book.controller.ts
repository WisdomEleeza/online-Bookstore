import { Request, Response, NextFunction, Router } from "express";
import HttpException from "@/utils/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validateBook from "@/resources/book/book.validate";
import BookService from "./book.service";
import logger from "@/utils/logger";

class BookController {
  private router = Router();
  private BookService = new BookService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      "/book/create-book",
      validationMiddleware(validateBook.BookValidation),
      this.PostBook,
    );
  }

  private PostBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { title, author, ISBN, genre, price, quantityAvailable } = req.body;

      const bookCreation = await this.BookService.CreateBook(
        title,
        author,
        ISBN,
        genre,
        price,
        quantityAvailable,
      );

      res.status(201).json({
        success: true,
        message: "Book Created Successfully",
        bookCreation,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.info("Error Occurred During Book Creation");
        return next(new HttpException(400, error.message));
      }
    }
  };
}

export default BookController;

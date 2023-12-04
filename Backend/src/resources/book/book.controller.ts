import { Request, Response, NextFunction, Router } from "express";
import HttpException from "../../utils/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validateBook from "../../resources/book/book.validate";
import BookService from "./book.service";
import logger from "../../utils/logger";

class BookController {
  public router = Router();
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

    this.router.put(
      "/book/update-book/:id",
      validationMiddleware(validateBook.BookValidation),
      this.UpdateBook,
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

  public UpdateBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { title, author, ISBN, genre, price, quantityAvailable } = req.body;

      const bookUpdating = await this.BookService.updateBook(id, {
        title,
        author,
        ISBN,
        genre,
        price,
        quantityAvailable,
      });

      res.status(201).json({
        success: true,
        message: "Book Updated Successfully",
        bookUpdating,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.info("Error Occurred During Book Update", error);
        return next(new HttpException(400, error.message));
      }
    }
  };
}

export default BookController;

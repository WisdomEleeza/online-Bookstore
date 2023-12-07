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

    this.router.delete("/book/delete-book/:id", this.DeleteBook);
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
      console.log(req.params);
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

  public DeleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const book = await this.BookService.deleteBook(id);

      res
        .status(200)
        .json({ success: true, message: "Book Deleted Successfully", book });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error occurred:", error);
        logger.info("Error Deleting Book", error);
        return next(new HttpException(500, error.message));
      }
    }
  };
}

export default BookController;

import { Request, Response, NextFunction, Router } from "express";
import HttpException from "../../utils/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validateBook from "../../resources/book/book.validate";
import BookService from "./book.service";
import logger from "../../utils/logger";
import authenticatedMiddleware from "../../middleware/authentication.middleware";

class BookController {
  public router = Router();
  private BookService = new BookService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      "/book/create-book/:id",
      validationMiddleware(validateBook.BookValidation),
      authenticatedMiddleware,
      this.PostBook,
    );

    this.router.put(
      "/book/update-book/:id",
      validationMiddleware(validateBook.BookValidation),
      authenticatedMiddleware,
      this.UpdateBook,
    );

    this.router.delete(
      "/book/delete-book/:id",
      authenticatedMiddleware,
      this.DeleteBook,
    );

    this.router.get("/book/list-book", this.ListBooks);
  }

  private PostBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      //API Routes to Post/Create Book
      const { id } = req.params;
      const { title, author, ISBN, genre, price, quantityAvailable } = req.body;

      const bookCreation = await this.BookService.CreateBook(
        id,
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
        console.error("Checking Error", error);
        logger.info("Error Occurred During Book Creation");
        return next(new HttpException(400, error.message));
      }
    }
  };

  //API Routes to Update Book
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        logger.info("Error Occurred During Book Update", error);
        return next(new HttpException(400, error.message));
      }
    }
  };

  //API Routes to Delete Book
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        console.error("Error occurred:", error);
        logger.info("Error Deleting Book", error);
        return next(new HttpException(500, error.message));
      }
    }
  };

  public ListBooks = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const listBooks = await this.BookService.ListBooks();
      res.status(200).json({
        success: true,
        message: "Successfully Listed Books",
        listBooks,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      logger.info("Error Listing Books");
      if (error instanceof Error)
        return next(new HttpException(500, error.message));
    }
  };
}

export default BookController;

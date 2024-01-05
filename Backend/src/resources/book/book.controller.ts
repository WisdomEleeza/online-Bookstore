import { Request, Response, NextFunction, Router } from "express";
import HttpException from "../../utils/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validateBook from "../../resources/book/book.validate";
import BookService from "./book.service";
import logger from "../../utils/logger";
import authenticatedMiddleware from "../../middleware/authentication.middleware";

class BookController {
  public router = Router();
  private bookService: BookService; // Dependency Injection: Injecting BookService dependency

  // Dependency Injection: Passing BookService instance through constructor
  constructor(bookService: BookService) {
    this.bookService = bookService;
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      "/book/create-book/:id",
      validationMiddleware(validateBook.BookValidation),
      authenticatedMiddleware,
      this.PostBook,
    );

    this.router.patch(
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
    this.router.get("/book/view-book-details/:id", this.viewBookDetails);
    this.router.get("/book/search", this.searchBooks);
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

      const bookCreation = await this.bookService.CreateBook(
        // Using injected bookService
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

      const bookUpdating = await this.bookService.updateBook(id, {
        // Using injected bookService
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

      await this.bookService.deleteBook(id); // Using injected bookService

      // Confirm the deletion before sending a success response
      const deletedBook = await this.bookService.viewBookDetails(id);
      if (!deletedBook) {
        res
          .status(200)
          .json({ success: true, message: "Book Deleted Successfully" });
      } else {
        res.status(404).json({ success: false, message: "Book Not Found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.info("Error Deleting Book", error);
        return next(new HttpException(500, error.message));
      }
    }
  };

  //API Routes to List Book with Pagination
  public ListBooks = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 5;

      const listBooks = await this.bookService.ListBooks(skip, take); // Using injected bookService
      res.status(200).json({
        success: true,
        message: "Successfully Listed Books",
        listBooks,
      });
    } catch (error) {
      // res
      //   .status(500)
      //   .json({ success: false, message: "Internal Server Error" });
      logger.info("Error Listing Books");
      if (error instanceof Error)
        return next(new HttpException(500, "Error Listing Books"));
    }
  };

  //Method for API Routes to View Books Details
  public viewBookDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const viewBookDetails = await this.bookService.viewBookDetails(id); // Using injected bookService

      if (viewBookDetails) {
        res
          .status(200)
          .json({ success: true, message: "Success", viewBookDetails });
      } else {
        res.status(404).json({ success: false, message: "Book Not Found" });
      }
    } catch (error) {
      logger.error("Error Viewing Details of Books", error);
      if (error instanceof Error)
        return next(new HttpException(500, "Error Viewing Book Details"));
      console.log("Error occurred:");
    }
  };

  public async searchBooks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const title = req.query.title as string;
      const author = req.query.author as string;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      console.log("I can't find the problem to bookService undefined");
      // const book = await this.bookService.getbook();
      const books = await this.bookService.searchBook(
        title,
        author,
        skip,
        take,
      );

      // console.log("Books::", book);
      res.status(200).json({ books });
    } catch (error) {
      console.log(error);
      if (error instanceof Error)
        console.log("Error Searching Books", error.message);
      return next(new HttpException(500, "Error exception during book search"));
    }
  }
}

export default BookController;

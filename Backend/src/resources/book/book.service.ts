// import bookValidate from "./book.validate";
import logger from "../../utils/logger";
import { Book, PrismaClient } from "@prisma/client";

class BookService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async CreateBook(
    userId: string,
    title: string,
    author: string,
    ISBN: string,
    genre: string,
    price: number,
    quantityAvailable: number,
  ): Promise<Book> {
    try {
      //API to Post/Create Book
      const book = await this.prisma.book.create({
        data: {
          user: { connect: { id: userId } },
          title,
          author,
          ISBN,
          genre,
          price,
          quantityAvailable,
        },
      });
      return book;
    } catch (error) {
      logger.info("Error creating book", error);
      throw new Error("Unable to create book");
    }
  }

  //API to Update Book
  public async updateBook(
    bookId: string,
    updateData: {
      title: string;
      author: string;
      ISBN: string;
      genre: string;
      price: number;
      quantityAvailable: number;
    },
  ): Promise<Book> {
    try {
      const book = await this.prisma.book.findUnique({ where: { id: bookId } });

      if (!book) throw new Error("Book Not Found");

      const bookUpdate = await this.prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          ...updateData,
        },
      });
      return bookUpdate;
    } catch (error) {
      logger.info("Error Updating Book", error);
      throw new Error("Error Occurred During Book Updating");
    }
  }

  //API to Delete Book
  public async deleteBook(bookId: string): Promise<Book | void> {
    try {
      const book = await this.prisma.book.findUnique({ where: { id: bookId } });

      if (!book) throw new Error("Book Not Found");

      const BookDelete = await this.prisma.book.delete({
        where: { id: bookId },
      });
      return BookDelete;
    } catch (error) {
      logger.info("Error Deleting Book", error);
      throw new Error("Unable to Delete Book");
    }
  }

  // Create API endpoints for listing books, viewing book details, searching, and filtering.
}

export default BookService;

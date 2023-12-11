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
      //Method for API Business Logic to Post/Create Book
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

  //Method for API Business Logic to Update Book
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

  //Method for API Business Logic to Delete Book
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

  //Method for API Business Logic to List Books
  public async ListBooks(
    page: number,
    pageSize: number,
  ): Promise<{ books: Book[]; hasMore: boolean } | void> {
    try {
      // Ensure that page is always greater than or equal to 1
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * pageSize;
      const take = pageSize + 1; // Fetch one extra record to check if there are more

      const listBooks = await this.prisma.book.findMany({ skip, take });

      const hasMore = listBooks.length > pageSize;

      // If there's one extra record, remove it from the result set
      if (hasMore) listBooks.pop();

      return { books: listBooks, hasMore };
    } catch (error) {
      logger.error("Error Occurred During Book Listing");
      if (error instanceof Error) throw new Error("Error Listing Books");
    }
  }
  // Create API endpoints for listing books, viewing book details, searching, and filtering.

  //Method for API Business Logic to View Books Details
  public async viewBookDetails(id: string): Promise<Book | void> {
    try {
      const book = await this.prisma.book.findUnique({
        where: { id: id },
      });

      if (!book) throw new Error("Book Not Found");

      return book;
    } catch (error) {
      console.log("Error:::", error);
      logger.error("Error viewing books");
      if (error instanceof Error) throw new Error("Error Viewing Book Details");
    }
  }
}

export default BookService;

import logger from "../../utils/logger";
import { Book, PrismaClient } from "@prisma/client";

class BookService {
  public prisma: PrismaClient;

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
      const bookExists = await this.prisma.book.findFirst({
        where: { title: title },
      });

      if (bookExists) throw new Error("Book already Exist");

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
      throw new Error("Book already Exist");
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
      console.log("Error", error);
      // throw new Error("Error Occurred During Book Updating");
      throw new Error("Book Not Found");
    }
  }

  //Method for API Business Logic to Delete Book
  public async deleteBook(bookId: string): Promise<Book | void> {
    try {
      const book = await this.prisma.book.findUnique({ where: { id: bookId } });

      if (!book) throw new Error("Book Not Found");

      await this.prisma.book.delete({
        where: { id: bookId },
      });
      return;
    } catch (error) {
      logger.info("Error Deleting Book", error);
      throw new Error("Book Not Found");
    }
  }

  //Method for API Business Logic to List Books
  public async ListBooks(
    page: number,
    pageSize: number,
  ): Promise<Book[] | void> {
    try {
      // Ensure that page is always greater than or equal to 1
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * pageSize;
      const take = pageSize + 1; // Fetch one extra record to check if there are more

      const listBooks = await this.prisma.book.findMany({ skip, take });

      const hasMore = listBooks.length > pageSize;

      // If there's one extra record, remove it from the result set
      if (hasMore) listBooks.pop();

      return listBooks;
    } catch (error) {
      logger.error("Error Occurred During Book Listing");
      if (error instanceof Error) throw new Error("Error Listing Books");
    }
  }

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
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  // public async getbook() {
  //   console.log("title");
  // }

  //Method for API Business Logic to Search Books
  public async searchBook(
    title: string,
    author: string,
    page: number,
    pageSize: number,
  ) {
    try {
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * pageSize;
      const take = pageSize + 1;

      const books = await this.prisma.book.findMany({
        where: {
          title: { contains: title, mode: "insensitive" },
          author: { contains: author, mode: "insensitive" },
        },
        skip,
        take,
      });

      return books;
    } catch (error) {
      console.error("Error Searching Book", error);
      if (error instanceof Error) throw new Error("Error Searching Book");
    }
  }
}

export default BookService;

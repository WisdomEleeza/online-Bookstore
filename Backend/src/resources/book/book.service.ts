// import bookValidate from "./book.validate";
import logger from "../../utils/logger";
import { Book, PrismaClient } from "@prisma/client";

class BookService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async CreateBook(
    title: string,
    author: string,
    ISBN: string,
    genre: string,
    price: number,
    quantityAvailable: number,
  ): Promise<Book> {
    try {
      const book = await this.prisma.book.create({
        data: {
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
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) throw new Error("Book Not Found");

    const bookUpdate = await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...updateData
      },
    });
    return bookUpdate;
  }
}

export default BookService;

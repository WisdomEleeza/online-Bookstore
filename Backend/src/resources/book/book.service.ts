// import bookValidate from "./book.validate";
import logger from "@/utils/logger";
import { PrismaClient } from "@prisma/client";

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
    quantityAvailable?: string,
  ): Promise <string>{
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
}

export default BookService;

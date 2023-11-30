import bookValidate from "./book.validate";
import { PrismaClient } from "@prisma/client";

class BookService {
  prisma: PrismaClient;
}

export default BookService;

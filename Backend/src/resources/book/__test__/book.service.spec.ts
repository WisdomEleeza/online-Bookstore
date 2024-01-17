import BookService from "../../book/book.service";

// Manually create a mock for Prisma client
const prismaMock = {
  book: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  // Add other models as needed
};

// Mock the Prisma client
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

describe("BookService", () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService();
  });

  describe("CreateBook", () => {
    it("should create a book successfully", async () => {
      // Arrange
      prismaMock.book.findFirst.mockResolvedValue(null);

      prismaMock.book.create.mockResolvedValue({
        id: "1",
        userId: "user123",
        title: "Test Book",
        author: "Test Author",
        ISBN: "1234567890",
        genre: "Fiction",
        price: 19.99,
        quantityAvailable: 10,
      });

      // Act
      const createdBook = await bookService.CreateBook(
        "user123",
        "Test Book",
        "Test Author",
        "1234567890",
        "Fiction",
        19.99,
        10,
      );

      // Assert
      expect(createdBook).toBeDefined();
      expect(createdBook.title).toBe("Test Book");
      expect(createdBook.author).toBe("Test Author");

      // Verify that findFirst and create methods were called with the expected arguments
      expect(prismaMock.book.findFirst).toHaveBeenCalledWith({
        where: { title: "Test Book" },
      });
      expect(prismaMock.book.create).toHaveBeenCalledWith({
        data: {
          user: { connect: { id: "user123" } },
          title: "Test Book",
          author: "Test Author",
          ISBN: "1234567890",
          genre: "Fiction",
          price: 19.99,
          quantityAvailable: 10,
        },
      });
    });

    it("should throw an error if the book already exists", async () => {
      // Arrange
      prismaMock.book.findFirst.mockResolvedValue({
        id: "2",
        userId: "user456",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      });

      // Act and Assert
      await expect(
        bookService.CreateBook(
          "user456",
          "Existing Book",
          "Existing Author",
          "0987654321",
          "Non-Fiction",
          29.99,
          5,
        ),
      ).rejects.toThrow("Book already Exist");
    });

    // Add more test cases for different scenarios
  });

  describe("Update Book", () => {
    it("should throw 'Book Not Found' error", async () => {
      // Arrange
      prismaMock.book.findUnique.mockResolvedValue(null);

      // Act and Assert
      await expect(
        bookService.updateBook("1", {
          title: "Updated Book Title",
          author: "Updated Author",
          ISBN: "1234567890",
          genre: "Fiction",
          price: 19.99,
          quantityAvailable: 10,
        }),
      ).rejects.toThrow("Book Not Found");

      // Verify that findUnique method was called with the expected arguments
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should update book successfully", async () => {
      // Arrange
      const existingBook = {
        id: "1",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      };
      prismaMock.book.findUnique.mockResolvedValue(existingBook);

      const updatedBookData = {
        title: "Updated Book Title",
        author: "Updated Author",
        ISBN: "1234567890",
        genre: "Fiction",
        price: 19.99,
        quantityAvailable: 10,
      };
      prismaMock.book.update.mockResolvedValue({
        ...existingBook,
        ...updatedBookData,
      });

      // Act
      const updatedBook = await bookService.updateBook("1", updatedBookData);

      // Assert
      expect(updatedBook).toBeDefined();
      expect(updatedBook.title).toBe("Updated Book Title");
      expect(updatedBook.author).toBe("Updated Author");

      // Verify that findUnique and update methods were called with the expected arguments
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prismaMock.book.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: updatedBookData,
      });
    });

    // Add more test cases for different scenarios
  });

  describe("Delete Book", () => {
    it("should throw 'Book Not Found' error", async () => {
      // Arrange
      prismaMock.book.findUnique.mockResolvedValue(null);

      // Act and Assert
      await expect(bookService.deleteBook("1")).rejects.toThrow(
        "Book Not Found",
      );

      // Verify that findUnique method was called with the expected arguments
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should delete book successfully", async () => {
      // Arrange
      const existingBook = {
        id: "1",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      };
      prismaMock.book.findUnique.mockResolvedValue(existingBook);

      // Act
      const deletedBook = await bookService.deleteBook("1");

      // Assert
      expect(deletedBook).toBeUndefined();

      // Verify that findUnique and delete methods were called with the expected arguments
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prismaMock.book.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    // Add more test cases for different scenarios
  });

  describe("List Book", () => {
    it("should list all books", async () => {
      // Arrange
      const listBooks = [
        {
          id: "1",
          title: "Title 1",
          author: "Author 1",
          ISBN: "209873897ADB",
          genre: "Fiction",
          price: 29.99,
          quantityAvailable: 5,
        },
        // Add more book data as needed
      ];
      prismaMock.book.findMany.mockResolvedValue(listBooks);

      // Act
      // const books = await bookService.ListBooks(1, 5);

      // Assert
      // expect(books).toHaveLength(listBooks.length);

      // // Verify that findMany method was called with the expected arguments
      // expect(prismaMock.book.findMany).toHaveBeenCalledWith({
      //   skip: 0,
      //   take: 5,
      // });
    });

    // Add more test cases for different scenarios
  });

  describe("View Book Details", () => {
    // Add test cases for viewing book details
    it("should view book details successfully", async () => {
      // Add your test case logic here
    });
  });

  describe("Search Book", () => {
    // Add test cases for searching books
    it("should search books successfully", async () => {
      // Add your test case logic here
    });
  });
});

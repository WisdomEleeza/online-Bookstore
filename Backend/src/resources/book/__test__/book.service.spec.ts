import BookService from "../../book/book.service";

// Mock the Prisma client
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    book: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));

describe("BookService", () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService();
  });

  describe("CreateBook", () => {
    it("should create a book successfully", async () => {
      // Mock the findFirst method to return null, indicating that the book doesn't exist
      (bookService.prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

      // Mock the create method to return a dummy book
      (bookService.prisma.book.create as jest.Mock).mockResolvedValue({
        id: "1",
        userId: "user123",
        title: "Test Book",
        author: "Test Author",
        ISBN: "1234567890",
        genre: "Fiction",
        price: 19.99,
        quantityAvailable: 10,
      });

      const createdBook = await bookService.CreateBook(
        "user123",
        "Test Book",
        "Test Author",
        "1234567890",
        "Fiction",
        19.99,
        10,
      );

      expect(createdBook).toBeDefined();
      expect(createdBook.title).toBe("Test Book");
      expect(createdBook.author).toBe("Test Author");

      // Verify that findFirst and create methods were called with the expected arguments
      expect(
        bookService.prisma.book.findFirst as jest.Mock,
      ).toHaveBeenCalledWith({
        where: { title: "Test Book" },
      });
      expect(bookService.prisma.book.create as jest.Mock).toHaveBeenCalledWith({
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
      // Mock the findFirst method to return an existing book
      (bookService.prisma.book.findFirst as jest.Mock).mockResolvedValue({
        id: "2",
        userId: "user456",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      });

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
      // Mock the Prisma client to return null, indicating the book is not found
      (bookService.prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

      // Call the updateBook method and expect it to throw an error
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
      expect(
        bookService.prisma.book.findUnique as jest.Mock,
      ).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should update book successfully", async () => {
      // Mock the Prisma client to return an existing book
      const existingBook = {
        id: "1",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      };
      (bookService.prisma.book.findUnique as jest.Mock).mockResolvedValue(
        existingBook,
      );

      // Mock the Prisma client's update method to return the updated book data
      const updatedBookData = {
        title: "Updated Book Title",
        author: "Updated Author",
        ISBN: "1234567890",
        genre: "Fiction",
        price: 19.99,
        quantityAvailable: 10,
      };
      (bookService.prisma.book.update as jest.Mock).mockResolvedValue({
        ...existingBook,
        ...updatedBookData,
      });

      // Call the updateBook method
      const updatedBook = await bookService.updateBook("1", updatedBookData);

      // Assert the results
      expect(updatedBook).toBeDefined();
      expect(updatedBook.title).toBe("Updated Book Title");
      expect(updatedBook.author).toBe("Updated Author");

      // Verify that findUnique and update methods were called with the expected arguments
      expect(
        bookService.prisma.book.findUnique as jest.Mock,
      ).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(bookService.prisma.book.update as jest.Mock).toHaveBeenCalledWith({
        where: { id: "1" },
        data: updatedBookData,
      });
    });
  });

  describe("Delete Book", () => {
    it("should throw 'Book Not Found' error", async () => {
      // Mock the findUnique method to return null, indicating that the book doesn't exist
      (bookService.prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

      // Call the deleteBook method and expect it to throw an error
      await expect(bookService.deleteBook("1")).rejects.toThrow(
        "Book Not Found",
      );

      // Verify that findUnique method was called with the expected arguments
      expect(
        bookService.prisma.book.findUnique as jest.Mock,
      ).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should delete book successfully", async () => {
      // Mock the findUnique method to return an existing book
      const existingBook = {
        id: "1",
        title: "Existing Book",
        author: "Existing Author",
        ISBN: "0987654321",
        genre: "Non-Fiction",
        price: 29.99,
        quantityAvailable: 5,
      };
      (bookService.prisma.book.findUnique as jest.Mock).mockResolvedValue(
        existingBook,
      );

      // Call the deleteBook method
      const deletedBook = await bookService.deleteBook("1");

      // Assert the results
      expect(deletedBook).toBeUndefined(); // Since your deleteBook method returns void

      // Verify that findUnique and delete methods were called with the expected arguments
      expect(
        bookService.prisma.book.findUnique as jest.Mock,
      ).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(bookService.prisma.book.delete as jest.Mock).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });

  describe("List Book", () => {
    it("should list all books", async () => {
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
        {
          id: "2",
          title: "Title 2",
          author: "Author 2",
          ISBN: "209873897ADB",
          genre: "Fiction",
          price: 29.99,
          quantityAvailable: 5,
        },
        {
          id: "3",
          title: "Title 3",
          author: "Author 3",
          ISBN: "209873897ADB",
          genre: "Fiction",
          price: 29.99,
          quantityAvailable: 5,
        },
        {
          id: "4",
          title: "Title 4",
          author: "Author 4",
          ISBN: "209873897ADB",
          genre: "Fiction",
          price: 29.99,
          quantityAvailable: 5,
        },
        {
          id: "5",
          title: "Title 5",
          author: "Author 5",
          ISBN: "209873897ADB",
          genre: "Fiction",
          price: 29.99,
          quantityAvailable: 5,
        },
      ];
      (bookService.prisma.book.findMany as jest.Mock).mockResolvedValue({
        listBooks,
        hasMore: false,
      });

      // Call the listBooks method
      // const books = await bookService.ListBooks(1, 5);
      // await bookService.ListBooks(1, 5);

      // Assert the results
      // expect(books).toHaveLength(listBooks.length);

      // Verify that findMany method was called with the expected arguments
      //   expect(
      //     bookService.prisma.book.findMany as jest.Mock,
      //   ).toHaveBeenCalledWith({ skip: 0, take: 5 });
    });
  });

  describe("Describe View Book Details", () => {
    it("it should view book details", () => {});
  });

  describe("Search Book", () => {
    it("should search book with pagination", () => {});
  });
});

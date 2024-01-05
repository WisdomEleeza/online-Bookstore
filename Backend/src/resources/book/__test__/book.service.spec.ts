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
      // Mock the findFirst method to return null, indicating that the book doesn't exist
      (bookService.prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

      // Call the deleteBook method and expect it to throw an error
      expect(bookService.deleteBook("1")).rejects.toThrow("Book Not Found");

      // Verify that findUnique method was called with the expected arguments
      expect(
        bookService.prisma.book.findUnique as jest.Mock,
      ).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it('should delete book successfully', async ()=> {
       (bookService.prisma.book.findUnique)
    })
  });

  describe("List Book with pagination", () => {
    it("should list all books", () => {});
  });

  describe("View Book Details", () => {
    it("should view book details", () => {});
  });

  describe("Search Book", () => {
    it("should search book with pagination", () => {});
  });
});

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

  // Add more describe blocks for other methods (updateBook, deleteBook, ListBooks, viewBookDetails, searchBook)

  describe("Update Book", () => {
    it("should update book successfully", async () => {});
  });

  describe("Delete Book", () => {
    it("should delete book successfully", () => {});
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

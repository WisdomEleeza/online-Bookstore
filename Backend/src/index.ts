import 'dotenv/config'
import 'module-alias/register'
import App from './app'


const app = new App(
    Number(process.env.PORT)
)

app.listen()


// Call the listBooks method
      // const books = await bookService.ListBooks(1, 5);
      // await bookService.ListBooks(1, 5);

      // Assert the results
      // expect(books).toHaveLength(listBooks.length);

      // Verify that findMany method was called with the expected arguments
      //   expect(
      //     bookService.prisma.book.findMany as jest.Mock,
      //   ).toHaveBeenCalledWith({ skip: 0, take: 5 });
// app.ts
import express, { Application, urlencoded } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger";
import errorMiddleware from "./middleware/error.middleware";
import UserController from "./resources/users/user.controller";
import BookController from "./resources/book/book.controller";
import BookService from "./resources/book/book.service";
import UserServices from "./resources/users/user.service";

class App {
  public express: Application;
  public port: number;
  private prisma!: PrismaClient;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initialiseMiddleware();
    this.initialiseDatabase();
    this.initialiseErrorMiddleware();
    this.initialiseController();
  }

  private initialiseMiddleware(): void {
    // Set up middleware
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(urlencoded({ extended: true }));
  }

  private initialiseController(): void {
    // Instantiate BookService
    const bookService = new BookService();
    // Inject BookService into the BookController
    const bookController = new BookController(bookService);
    // Add Routes from Controllers
    this.express.use("/api/v1", bookController.router);

    // Instantiate UserService
    const userServices = new UserServices();
    // Inject UserService into the UserController
    const userController = new UserController(userServices);
    // Add Routes from Controllers
    this.express.use("/api/v1", userController.router);
  }

  private initialiseErrorMiddleware(): void {
    // Set up error middleware
    this.express.use(errorMiddleware);
  }

  private initialiseDatabase(): void {
    // Set up database connection
    const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PATH } = process.env;

    // Use these variables for PostgreSQL connection
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}${POSTGRES_PATH}`,
        },
      },
    });
  }

  public listen(): void {
    // Connect to the database and start listening for requests
    this.prisma.$connect();
    this.express.listen(this.port, () => {
      logger.info(`App is listening on port ${this.port}`);
    });
  }
}

export default App;

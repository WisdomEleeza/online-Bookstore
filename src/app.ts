import express, { Application, urlencoded } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
// import { Logger } from "concurrently";
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger";
import errorMiddleware from "./middleware/error.middleware";

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
    // this.initialiseController()
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(urlencoded({ extended: true }));
  }

  // private initialiseController(): void {
  //   this.express.use('/api')
  // }

  private initialiseErrorMiddleware(): void {
    this.express.use(errorMiddleware);
  }

  private initialiseDatabase(): void {
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
    this.prisma.$connect();
    this.express.listen(this.port, () => {
      logger.info(`App is listening on port ${this.port}`);
    });
  }
}

export default App;

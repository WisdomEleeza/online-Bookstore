import express, { Application, urlencoded } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

class App {
  public express: Application;
  public port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initialiseMiddleware();
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json())
    this.express.use(urlencoded({extended: true}))
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App is listening on port ${this.port}`);
    });
  }
}

export default App;

import { Router, Request, Response, NextFunction } from "express";
import HttpException from "@/utils/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validation from "@/resources/users/user.validate";
import UserServices from "./user.service";

class UserController {
  public router = Router();
  private UserServices = new UserServices();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      "/users/register",
      validationMiddleware(validation.register),
      this.register,
    );
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;
      const token = await this.UserServices.register(
        name,
        email,
        password,
        "user",
      );

      res.status(201).json(token)
    } catch (error) {
      if (error instanceof Error)
        return next(new HttpException(400, error.message));
    }
  };
}

export default UserController;

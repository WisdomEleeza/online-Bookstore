import { Router, Request, Response, NextFunction } from "express";
// import HttpException from "@/utils/http.exception";
import HttpException from "../../utils/http.exception";
// import validationMiddleware from "@/middleware/validation.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
// import validation from "@/resources/users/user.validate";
import validation from "../../resources/users/user.validate";
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
    this.router.post(
      "/users/login",
      validationMiddleware(validation.login),
      this.login,
    );
    // this.router.patch("/users/proflle-update", this.updateProfile);
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
      );

      res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        token: token,
      });
    } catch (error) {
      if (error instanceof Error)
        return next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserServices.login(email, password);
      res
        .status(200)
        .json({ success: true, message: "Login Successfully", token: token });
    } catch (error) {
      if (error instanceof Error) {
        return next(new HttpException(400, error.message));
      }
    }
  };

  // updateProfile = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<Response | void> => {
  //   const { name?, shippingAddress?, paymentMethod? } = req.body
  //   const user = await this.pris
  // };
}

export default UserController;

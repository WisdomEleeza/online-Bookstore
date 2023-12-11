// user.controller.ts
import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../utils/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validation from "../../resources/users/user.validate";
import UserServices from "./user.service";
import authenticatedMiddleware from "../../middleware/authentication.middleware";

class UserController {
  public router = Router();
  private userServices: UserServices;

  constructor(userServices: UserServices) {
    // Injecting userServices into the UserServices
    this.userServices = userServices;
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    // Register route
    this.router.post(
      "/users/register",
      validationMiddleware(validation.register),
      this.register,
    );

    // Login route
    this.router.post(
      "/users/login",
      validationMiddleware(validation.login),
      this.login,
    );

    // Update profile route
    this.router.put(
      "/users/profile/:id",
      validationMiddleware(validation.userProfile),
      authenticatedMiddleware,
      this.updateProfile,
    );
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      // Extract user registration data from the request body
      const { name, email, password, shippingAddress, paymentMethod } =
        req.body;

      // Register the user and get the authentication token
      const token = await this.userServices.register(
        name,
        email,
        password,
        shippingAddress,
        paymentMethod,
      );

      // Respond with the authentication token
      if (token) {
        return res.status(201).json({
          success: true,
          message: "User Registered Successfully",
          token: token,
        });
      } else {
        // User already exists
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
    } catch (error) {
      // Handle errors
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
      // Extract login credentials from the request body
      const { email, password } = req.body;

      // Login the user and get the authentication token
      const token = await this.userServices.login(email, password);

      // Respond with the authentication token
      return res
        .status(200)
        .json({ success: true, message: "Login Successful", token: token });
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        return next(new HttpException(400, error.message));
      }
    }
  };

  private updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      // Extract updated profile information from the request body
      const { name, shippingAddress, paymentMethod } = req.body;

      // Update the user's profile in the database
      const { id } = req.params;
      const updatedUser = await this.userServices.updateProfile(id, {
        name,
        shippingAddress,
        paymentMethod,
      });

      // Respond with the updated user profile
      return res.status(200).json({
        success: true,
        message: "User Profile Updated Successfully",
        updatedUser,
      });
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        return next(new HttpException(400, error.message));
      }
    }
  };
}

export default UserController;

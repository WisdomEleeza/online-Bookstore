import { PrismaClient, User } from "@prisma/client";
import token from "../..//utils/token";
import bcrypt from "bcrypt";
import logger from "../..//utils/logger";

class UserServices {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async register(
    name: string,
    email: string,
    password: string,
    shippingAddress: string,
    paymentMethod: string,
  ): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          shippingAddress,
          paymentMethod,
        },
      });
      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error) {
      logger.info("Error during user registration:", error);
      throw new Error("Unable to register user");
    }
  }

  public async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error("Unable to find user with that email address");

      const hashedPassword = await bcrypt.compare(password, user.password);

      if (hashedPassword) {
        return token.createToken(user);
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error) {
      logger.info(error);
      throw new Error("Unable to log in");
    }
  }

  public async updateProfile(
    userId: string,
    updateData: {
      name: string;
      shippingAddress: string;
      paymentMethod: string;
    },
  ): Promise<User> {
    try {
      // Find the user in the database
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");

      // Update the user's profile
      const updateUser = await this.prisma.user.update({
        where: { id: userId },
        data: { ...updateData },
      });

      return updateUser;
    } catch (error) {
      console.error("Error during profile update:", error);
      throw new Error("Unable to update profile");
    }
  }
}

export default UserServices;

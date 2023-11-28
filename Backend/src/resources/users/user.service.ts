import { PrismaClient } from "@prisma/client";
import token from "../../utils/token";
import bcrypt from "bcrypt";

class UserServices {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async register(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: role,
        },
      });
      const accessToken = token.createToken(user);
      return accessToken;
      // res.cookies('jwt', accessToken, { httpOnly: true, maxAge: maxAge * 1000})
    } catch (error) {
      console.error("Error during user registration:", error);
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
      console.log(error);

      throw new Error("Unable to log in");
    }
  }
}

export default UserServices;

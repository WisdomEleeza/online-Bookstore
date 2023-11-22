import { PrismaClient } from "@prisma/client";
import token from "@/utils/token";
const prisma = new PrismaClient();

class UserServices {
  private prisma = prisma;

  public async register(
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
          role,
        },
      });
      const accessToken = token.createToken(user);

      return accessToken;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An Unexpected Error Occurred");
      }
    }
  }
}

export default UserServices;

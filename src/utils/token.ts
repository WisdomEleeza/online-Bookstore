// Import the necessary libraries and modules
import * as dotenv from "dotenv"; // Import dotenv for loading environment variables
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for JWT functionality
import { User } from "@prisma/client"; // Import the User type from your Prisma client

// Load environment variables from the .env file
dotenv.config();

// Define a function that creates a JWT for a given user
export const createToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as  { id: string };
    return { isValid: true, decoded };
  } catch (error) {
    return { isValid: false };
  }
};

export default { createToken, verifyToken };
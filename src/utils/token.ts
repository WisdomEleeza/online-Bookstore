// Import the necessary libraries and modules
import * as dotenv from "dotenv"; // Import dotenv for loading environment variables
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for JWT functionality
import { User } from "@prisma/client"; // Import the User type from your Prisma client

// Load environment variables from the .env file
dotenv.config();

// Define a function that creates a JWT for a given user
export const createToken = (user: User): string => {
  // Use jwt.sign to create a JWT with the user's ID as the payload
  // process.env.JWT_SECRET is the secret key for signing the JWT, loaded from the environment variables
  // expiresIn: "1d" sets the expiration time of the token to 1 day
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

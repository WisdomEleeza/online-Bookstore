// import { PrismaClient } from "@prisma/client";

// class Shop_cartService {
//   public prisma: PrismaClient;

//   constructor() {
//     this.prisma = new PrismaClient();
//   }

//   // Method to add an item to the shopping cart for an authenticated user
//   public async PostShopCart(
//     userId: string, // The ID of the authenticated user
//     // user: string, // Assuming 'user' is a property of the item being added
//     // items: string, // The item being added to the shopping cart
//   ): Promise<Shop_cartService> {
//     try {
//       // Creating a new entry in the shopping cart
//       const postCart = await this.prisma.shoppingCart.create({
//         data: {
//           userId, // Associating the shopping cart with the authenticated user
//           //   user: { connect: { id: userId  } },
//         //   items, // Storing the item in the shopping cart
//         },
//       });

//     //   return postCart;
//     } catch (error) {
//       if (error instanceof Error) {
//         // You might want to log or handle the error in a more detailed way
//         throw new Error(error.message);
//       }
//     }
//   }
// }

// export default Shop_cartService;

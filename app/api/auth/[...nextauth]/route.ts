// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { LoginSchema } from "@/schemas"; // Import your schema
// import { getUserByEmail } from "@/data/user"; // Import your user function
// import { db } from "@/lib/db"; // Import Prisma client

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const validation = LoginSchema.safeParse(credentials);
//         if (!validation.success) {
//           throw new Error(validation.error.errors[0].message);
//         }

//         const { email, password } = credentials;

//         const user = await getUserByEmail(email);

//         if (!user) {
//           throw new Error("User not found");
//         }

//         // In a real app, you'd compare the provided password with the hashed password in your database.
//         if (password !== user.password) {
//           throw new Error("Invalid password");
//         }

//         // If successful, return the user object
//         return { id: user.id, name: user.username, email: user.email };
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session }) {
//       // Get user from the database by email
//       const sessionUser = await getUserByEmail(session.user.email);

//       if (sessionUser) {
//         // Attach the user's ID to the session object
//         session.user.id = sessionUser.id;
//       }

//       return session;
//     },
//     async signIn({ user }) {
//       try {
//         // Get user from the database by email
//         const userExists = await getUserByEmail(user.email);

//         if (!userExists) {
//           // If the user doesn't exist, create a new one using Prisma
//           await db.user.create({
//             data: {
//               email: user.email,
//               username: user.name.replace(" ", "").toLowerCase(),
//               image: user.image,
//               password: user.password // Remember to hash passwords in a real app
//             }
//           });
//         }

//         return true;
//       } catch (error) {
//           console.log("Error signing in:", error);
//           return false;
//       }
//     }
//   }
// });

// export { handler as GET, handler as POST };

import { handlers } from "@/auth" 
export const { GET, POST } = handlers
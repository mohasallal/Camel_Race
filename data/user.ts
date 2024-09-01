import { db } from "@/lib/db";

export type User = {
  id: string;
  FirstName: string;
  email: string;
};
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await db.user.findMany();

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

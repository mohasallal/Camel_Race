import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const updateUser = async (id: string, updatedData: Partial<User>) => {
  console.log('Attempting to update user with ID:', id);

  if (typeof id !== "string" || typeof updatedData !== "object") {
    throw new Error("Invalid input: ID or data format is incorrect");
  }

  try {
    const userExists = await db.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new Error("User not found");
    }

    const result = await db.user.update({
      where: { id },
      data: updatedData,
    });

    console.log("User updated successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Error updating user:", error.message || error);
    throw new Error("Error updating user");
  }
};

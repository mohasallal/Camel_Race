"use server";
import { db } from "@/lib/db";

// Ensure id is a number and properly handle it
export const deleteCamel = async (id: number) => {
  console.log('Attempting to delete camel with ID:', id);

  try {
    // Check if the camel exists
    const camelExists = await db.camel.findUnique({ where: { id } });
    if (!camelExists) {
      throw new Error("Camel not found");
    }

    // Delete the camel
    const result = await db.camel.delete({
      where: { id },
    });

    return result;
  } catch (error: any) {
    console.error("Error deleting camel:", error.message || error);
    throw new Error("Error deleting camel");
  }
};

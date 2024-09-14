import { db } from "@/lib/db";
import { Camel } from "@prisma/client";

export const updateCamel = async (id: number, updatedData: Partial<Camel>) => {
  console.log('Attempting to update camel with ID:', id);

  if (typeof id !== "number" || typeof updatedData !== "object") {
    throw new Error("Invalid input: ID or data format is incorrect");
  }

  try {
    // تحقق من وجود الجمل
    const camelExists = await db.camel.findUnique({ where: { id } });
    if (!camelExists) {
      throw new Error("Camel not found");
    }

    // تحديث الجمل
    const result = await db.camel.update({
      where: { id },
      data: updatedData,
    });

    console.log("Camel updated successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Error updating camel:", error.message || error);
    throw new Error("Error updating camel");
  }
};

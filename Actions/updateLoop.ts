// app/Actions/updateLoop.ts

import { db } from "@/lib/db";
import { Loop } from "@prisma/client";

export const updateLoop = async (id: string, updatedData: Partial<Loop>) => {
  console.log('Attempting to update loop with ID:', id);
  console.log('Update Data:', updatedData);

  if (typeof id !== "string" || typeof updatedData !== "object") {
    throw new Error("Invalid input: ID or data format is incorrect");
  }

  try {
    const loopExists = await db.loop.findUnique({ where: { id } });
    if (!loopExists) {
      throw new Error("Loop not found");
    }

    const result = await db.loop.update({
      where: { id },
      data: updatedData,
    });

    console.log("Loop updated successfully:", result);
    return result;
  } catch (error:any) {
    console.error("Error updating loop:", error);
    throw new Error(`Error updating loop: ${error.message}`);
  }
};

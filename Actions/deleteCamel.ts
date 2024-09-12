import { db } from "@/lib/db";

export const deleteCamel = async (id: number) => {
  console.log('Attempting to delete camel with ID:', id);
  if (typeof id !== "number"  ) {
    throw new Error("Invalid ID");
  }

  try {
    // التحقق من وجود الـ Camel
    const camelExists = await db.camel.findUnique({ where: { id } });
    if (!camelExists) {
      throw new Error("Camel not found");
    }

    // حذف الـ Camel
    const result = await db.camel.delete({
      where: { id },
    });

    return result;
  } catch (error: any) {
    console.error("Error deleting camel:", error.message || error);
    throw new Error("Error deleting camel");
  }
};

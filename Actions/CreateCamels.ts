"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { camelSchema } from "@/schemas";

export const createCamel = async (values: z.infer<typeof camelSchema>) => {
  console.log("Received values for camel creation:", values); // Log the input values

  const validatedFields = camelSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.errors); // Log the validation errors
    return { error: "! حقل غير صالح", details: validatedFields.error.errors };
  }

  const { name, camelID, age, sex, ownerId } = validatedFields.data;

  try {
    const existingCamel = await db.camel.findFirst({
      where: { camelID },
    });

    if (existingCamel) {
      return { error: "الجمل موجود بالفعل" };
    }

    await db.camel.create({
      data: {
        name,
        camelID,
        age,
        sex,
        ownerId,
      },
    });

    return {
      success: "! تم انشاء الجمل",
    };
  } catch (error) {
    console.error("Error creating camel in database:", error);
    return { error: "حدث خطأ أثناء إضافة الجمل", details: error };
  }
};

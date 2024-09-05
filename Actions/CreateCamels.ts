"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { camelSchema } from "@/schemas";

export const createCamel = async (values: z.infer<typeof camelSchema>) => {
  const validatedFields = camelSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.data);
    return { error: "حقل غير صالح", details: validatedFields.error.errors };
  }

  const { name, camelID, age, sex, ownerId, loopId } = validatedFields.data;

  try {
    await db.camel.create({
      data: {
        name,
        camelID,
        age,
        sex,
        ownerId,
        loopId,
      },
    });
    return { success: "تم انشاء الجمل" };
  } catch (error) {
    console.error("Error creating camel:", error);
    return { error: "حدث خطأ أثناء إنشاء الجمل" };
  }
};

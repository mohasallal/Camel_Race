"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { createLoopSchema } from "@/schemas";

export const createLoop = async (
  values: z.infer<typeof createLoopSchema>,
  eventId: string 
) => {
  console.log("Received values for Loop creation:", values);

  const validatedFields = createLoopSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.errors);
    return { error: "! حقل غير صالح", details: validatedFields.error.errors };
  }

  const { capacity, age, sex, time, startRegister, endRegister } =
    validatedFields.data;

  try {
    const existingEvent = await db.event.findFirst({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { error: "! الحدث غير موجود" };
    }

    await db.loop.create({
      data: {
        capacity,
        age,
        sex,
        time,
        startRegister,
        endRegister,
        eventId, 
      },
    });

    return {
      success: "! تم انشاء الحلقة",
    };
  } catch (error) {
    console.error("Error creating loop in database:", error);
    return { error: "حدث خطأ أثناء إضافة الحلقة", details: error };
  }
};

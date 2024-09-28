"use server";
import { db } from "@/lib/db";
import { registerCamelSchema } from "@/schemas";

export const registerCamelInLoop = async (values: {
  camelId: number;
  loopId: string;
}) => {
  const validatedFields = registerCamelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input", details: validatedFields.error.errors };
  }

  const { camelId, loopId } = validatedFields.data;

  try {
    const camel = await db.camel.findUnique({
      where: { id: camelId },
    });
    const loop = await db.loop.findUnique({
      where: { id: loopId },
    });

    if (!camel) {
      return { error: "الجمل غير موجود" };
    }
    if (!loop) {
      return { error: "الشوط غير موجود" };
    }

    if (camel.age !== loop.age || camel.sex !== loop.sex) {
      return { error: "Camel does not meet the loop's criteria" };
    }

    const camelLoopCount = await db.camelLoop.count({
      where: { loopId },
    });

    if (camelLoopCount >= loop.capacity) {
      return { error: "الشوط ممتلئ" };
    }

    const existingRegistration = await db.camelLoop.findFirst({
      where: {
        loopId: String(loopId),
        camelId: camelId,
      },
    });

    if (existingRegistration) {
      return { error: "الجمل مسجل بالفعل !" };
    }

    await db.camelLoop.create({
      data: {
        camelId,
        loopId,
      },
    });

    return { success: "تم تسجيل الجمل بنجاح !" };
  } catch (error) {
    console.error("حدث خطأ في تسحيل الجمل:", error);
    return { error: "An error occurred while registering the camel" };
  }
};

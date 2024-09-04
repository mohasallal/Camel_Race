"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { EventsSchema } from "@/schemas";

export const createEventAction = async (values: z.infer<typeof EventsSchema>) => {
  console.log(values);

  const validatedFields = EventsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "! حقل غير صالح" };
  }

  const { name, StartDate, EndDate } = validatedFields.data;

  const existingEvent = await db.event.findFirst({
    where: { name, StartDate, EndDate },
  });
  if (existingEvent) {
    return { error: "الحدث موجود بالفعل" };
  }

  await db.event.create({
    data: {
      name,
      StartDate,
      EndDate,
    },
  });



  return {
    success: "! تم انشاء الحدث",
  };
};

// File: app/actions/createLoop.ts

"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { createLoopSchema } from "@/schemas";

export const createLoop = async (
  values: z.infer<typeof createLoopSchema>,
  eventId: string
) => {
  console.log("Received values for Loop creation:", values);

  // Validate data
  const validatedFields = createLoopSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid data", details: validatedFields.error.errors };
  }

  const { capacity, age, sex, time, startRegister, endRegister } =
    validatedFields.data;

  try {
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return { error: "Event not found" };
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

    return { success: "Loop created successfully" };
  } catch (error) {
    console.error("Error creating loop:", error);
    return { error: "Error creating loop", details: error };
  }
};

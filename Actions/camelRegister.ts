// File: app/actions/registerCamelInLoop.ts

"use server";

import { z } from "zod";
import { db } from "@/lib/db"; 

const registerCamelSchema = z.object({
  camelId: z.number(), 
  loopId: z.string(), 
});

export const registerCamelInLoop = async (values: {
  camelId: number;
  loopId: string;
}) => {
  const validatedFields = registerCamelSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.errors);
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
      return { error: "Camel does not exist" };
    }
    if (!loop) {
      return { error: "Loop does not exist" };
    }

    if (camel.age !== loop.age || camel.sex !== loop.sex ) {
      return { error: "Camel does not meet the loop's criteria" };
    }

    const camelLoopCount = await db.camelLoop.count({
      where: { loopId },
    });

    if (camelLoopCount >= loop.capacity) {
      return { error: "The loop is full" };
    }

    await db.camelLoop.create({
      data: {
        camelId,
        loopId,
      },
    });

    return { success: "Camel registered successfully!" };
  } catch (error) {
    console.error("Error registering camel:", error);
    return { error: "An error occurred while registering the camel" };
  }
};

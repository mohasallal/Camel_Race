"use server";
import { db } from "@/lib/db";
import { raceResultSchema } from "@/schemas";

export async function createRaceResult(data: any) {
  const result = raceResultSchema.safeParse(data);
  if (!result.success) {
    console.error("Validation errors:", result.error.issues);
    throw new Error("Invalid race result data");
  }

  const {
    rank,
    eventId,
    ownerId,
    camelId,
    loopId,
    IBAN,
    bankName,
    swiftCode,
    ownerName,
  } = result.data;

  try {
    const raceResult = await db.raceResult.create({
      data: {
        rank,
        eventId,
        ownerId,
        camelId,
        loopId,
        IBAN: IBAN,
        bankName: bankName,
        swiftCode: swiftCode,
        ownerName,
      },
    });
    console.log("Processing race result:", data);
    return raceResult;
  } catch (error: any) {
    console.error("Error creating race result:", error);
    throw new Error("Failed to create race result: " + error.message);
  }
}

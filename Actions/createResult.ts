"use server";
import { db } from "@/lib/db";
import { raceResultSchema } from "@/schemas";

export async function createRaceResult(data: any) {
  // Validate the incoming data against the schema
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
    NationalID, // Adding NationalID here
    camelID,    // Adding camelID here
  } = result.data;

  try {
    const raceResult = await db.raceResult.create({
      data: {
        rank,
        eventId,
        ownerId,
        camelId,
        loopId,
        IBAN,
        bankName,
        swiftCode,
        ownerName,
        NationalID, // Storing NationalID in the database
        camelID,    // Storing camelID in the database
      },
    });
    return raceResult;
  } catch (error: any) {
    console.error("Error creating race result:", error);
    throw new Error("Failed to create race result: " + error.message);
  }
}

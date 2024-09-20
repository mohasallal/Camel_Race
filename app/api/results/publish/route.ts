import { createRaceResult } from "@/Actions/createResult";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Received data:", data);

    const raceResults = await Promise.all(
      data.map(async (result: any) => {
        console.log("Processing result:", result);

        return await createRaceResult(result);
      })
    );

    return NextResponse.json({ success: true, raceResults });
  } catch (error) {
    console.error("Error creating race results:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

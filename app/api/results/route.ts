import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const results = await db.raceResult.findMany({
      include: {
        camel: true,
        owner: true,
        event: true,
        loop: true,
      },
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch race results." },
      { status: 500 }
    );
  }
}

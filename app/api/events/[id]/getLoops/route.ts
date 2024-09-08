import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const loops = await db.loop.findMany({ where: { eventId } });

    if (!loops.length) {
      return NextResponse.json({ error: "No loops found" }, { status: 404 });
    }

    return NextResponse.json(loops, { status: 200 });
  } catch (error) {
    console.error("Error fetching loops:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

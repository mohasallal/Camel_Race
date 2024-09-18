import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "ID is required." }, { status: 400 });
  }

  try {
    const data = await req.json();
    const result = await db.raceResult.update({
      where: { id },
      data,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update race result." },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.pathname.split('/').pop();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const camels = await db.camel.findMany({
      where: { ownerId: userId }, 
    });

    return NextResponse.json(camels);
  } catch (error) {
    console.error("Error fetching camels:", error);
    return NextResponse.json({ error: "Error fetching camels" }, { status: 500 });
  }
}

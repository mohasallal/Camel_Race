import { createLoop } from "@/Actions/CreateLoops";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await req.json();
    console.log("Received body:", body); // Log body to debug

    const result = await createLoop(body, eventId);
    console.log("Result from createLoop:", result);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: result.success }, { status: 201 });
  } catch (error) {
    console.error("Error in creating loop:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

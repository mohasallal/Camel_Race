// app/api/events/[id]/getLoops/[loopsId]/updateLoop/route.ts

import { updateLoop } from "@/Actions/updateLoop";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    console.log('Received PUT request');
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // Extract loopsId from the path
    const loopsId = pathParts[pathParts.length - 2]; // Assuming 'updateLoop' is the last segment
    console.log('Extracted loopsId:', loopsId);

    if (!loopsId || typeof loopsId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    // Call updateLoop
    await updateLoop(loopsId, body);

    return NextResponse.json({ message: "Loop updated successfully" });
  } catch (error) {
    console.error("Error updating loop:", error);
    return NextResponse.json({ error: "Error updating loop" }, { status: 500 });
  }
}

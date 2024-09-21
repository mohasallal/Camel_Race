import { deleteEvent } from "@/Actions/deleteEvent";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  
  const idString = pathParts[pathParts.length - 2];
  
  console.log('Extracted ID:', idString);

  if (!idString || typeof idString !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await deleteEvent(idString);
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}

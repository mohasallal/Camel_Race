import { deleteCamel } from "@/Actions/deleteCamel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const idString = pathParts[pathParts.length - 2]; // قم بتعديل هذا حسب هيكل URL
  const id = parseInt(idString, 10);

  console.log('Extracted ID:', id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await deleteCamel(id);
    return NextResponse.json({ message: "Camel deleted successfully" });
  } catch (error) {
    console.error("Error deleting camel:", error);
    return NextResponse.json({ error: "Error deleting camel" }, { status: 500 });
  }
}


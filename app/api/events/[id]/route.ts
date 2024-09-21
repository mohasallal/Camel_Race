import { createEventAction } from "@/Actions/Events";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createEventAction(data); // Call the createEvent function with the parsed data

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 }); // Return 201 status code on success
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب" }, // Error message in Arabic
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { camelSchema } from "@/schemas";
import { createCamel } from "@/Actions/CreateCamels";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createCamel(data);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب" },
      { status: 500 }
    );
  }
}

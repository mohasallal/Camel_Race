import { registerCamelInLoop } from "@/Actions/camelRegister";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { loopId: string } }
) {
  try {
    const body = await req.json();
    const { camelId } = body;

    const loopId = params.loopId;

    const result = await registerCamelInLoop({ camelId, loopId });

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error registering camel:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { createRaceResult } from "@/Actions/createResult";
import { NextResponse } from "next/server";
// تعطيل التخزين المؤقت وجعل الاستجابة ديناميكية
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function POST(req: Request) {
  try {
    const data = await req.json();


    const raceResults = await Promise.all(
      data.map(async (result: any) => {

        return await createRaceResult(result);
      })
    );

    return NextResponse.json({ success: true, raceResults });
  } catch (error) {
    console.error("Error creating race results:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

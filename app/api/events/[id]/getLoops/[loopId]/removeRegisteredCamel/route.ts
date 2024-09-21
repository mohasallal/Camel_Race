import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// تعطيل التخزين المؤقت وجعل الاستجابة ديناميكية
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function DELETE(req: NextRequest) {
  try {
    const { camelId } = await req.json();
    const url = new URL(req.url || "", `http://${req.headers.get("host")}`);
    const [_, , , , , loopId] = url.pathname.split("/");



    if (!camelId || !loopId) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const loop = await db.loop.findUnique({
      where: { id: loopId },
      select: { startRegister: true, endRegister: true },
    });


    if (!loop) {
      return NextResponse.json({ message: "Loop not found" }, { status: 404 });
    }

    const currentTime = new Date();

    if (currentTime > loop.endRegister) {
      return NextResponse.json(
        { message: "Registration period has ended" },
        { status: 403 }
      );
    }

    const camelIdNumber = parseInt(camelId, 10);

    await db.camelLoop.deleteMany({
      where: {
        camelId: camelIdNumber,
        loopId: loopId,
      },
    });

    return NextResponse.json(
      { message: "Camel removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing camel:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

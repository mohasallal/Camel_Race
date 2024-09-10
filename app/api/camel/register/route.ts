// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { camelId: camelIdString, loopId } = await req.json();

//     const camelId = parseInt(camelIdString, 10);

//     if (isNaN(camelId)) {
//       return NextResponse.json({ error: "Invalid camel ID" }, { status: 400 });
//     }

//     const loop = await db.loop.findUnique({
//       where: { id: loopId }
//     });

//     if (!loop) {
//       return NextResponse.json({ error: "Loop not found" }, { status: 404 });
//     }

//     const now = new Date();
//     if (now < loop.startRegister || now > loop.endRegister) {
//       return NextResponse.json({ error: "Registration window closed" }, { status: 400 });
//     }

//     const registeredCamelsCount = await db.camelLoop.count({
//       where: { loopId }
//     });

//     if (registeredCamelsCount >= loop.capacity) {
//       return NextResponse.json({ error: "Loop is full" }, { status: 400 });
//     }

//     const camel = await db.camel.findUnique({
//       where: { id: camelId } 
//     });

//     if (!camel) {
//       return NextResponse.json({ error: "Camel not found" }, { status: 400 });
//     }

//     if (camel.age !== loop.age || camel.sex !== loop.sex) {
//       return NextResponse.json({ error: "Camel does not meet the loop criteria" }, { status: 400 });
//     }

//     await db.camelLoop.create({
//       data: {
//         camelId: camel.id, 
//         loopId
//       },
//     });

//     return NextResponse.json({ success: true }, { status: 201 });
//   } catch (error) {
//     console.error("Error registering camel:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

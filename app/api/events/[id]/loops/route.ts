// import { db } from '@/lib/db';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   const body = await request.json();
//   const { capacity, gender, age, time, startRegister, endRegister } = body;

//   try {
//     const loop = await db.loop.create({
//       data: {
//         eventId: id,
//         capacity,
//         gender,
//         age,
//         time,
//         startRegister: new Date(startRegister),
//         endRegister: new Date(endRegister),
//       },
//     });

//     return NextResponse.json(loop, { status: 201 });
//   } catch (error) {
//     console.error("Error creating loop:", error);
//     return NextResponse.json({ error: "Failed to create loop" }, { status: 500 });
//   }
// }

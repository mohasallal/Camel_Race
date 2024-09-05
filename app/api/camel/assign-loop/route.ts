// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db'; 
// import { z } from 'zod';

// const assignCamelToLoopSchema = z.object({
//   camelId: z.string(),
//   loopId: z.string(),
// });

// export async function POST(req: Request) {
//   const body = await req.json();
//   const validation = assignCamelToLoopSchema.safeParse(body);

//   if (!validation.success) {
//     return NextResponse.json({ error: validation.error }, { status: 400 });
//   }

//   const { camelId, loopId } = validation.data;

//   try {
//     const updatedCamel = await db.camel.update({
//       where: { id: camelId },
//       data: { loopId },
//     });

//     return NextResponse.json(updatedCamel, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to assign camel to loop' }, { status: 500 });
//   }
// }

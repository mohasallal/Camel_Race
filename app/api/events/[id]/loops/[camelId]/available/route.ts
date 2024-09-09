// // app/api/loops/[camelId]/available.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { db } from '@/lib/db';
// import { getServerSession } from 'next-auth';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { camelId } = req.query;

//   // Fetch the camel by ID to know its age and sex
//   const camel = await db.camel.findUnique({
//     where: { id: Number(camelId) },
//     select: { age: true, sex: true }
//   });

//   if (!camel) return res.status(404).json({ message: 'Camel not found' });

//   // Get current time
//   const now = new Date();

//   // Find loops that match the camel's details and are within the registration window
//   const availableLoops = await db.loop.findMany({
//     where: {
//       age: camel.age,
//       sex: camel.sex,
//       startRegister: { lte: now },
//       endRegister: { gte: now },
//       CamelLoop: {
//         every: { camelId: { not: Number(camelId) } } // Exclude already registered loops
//       }
//     },
//     include: {
//       event: true, // Include event details if needed
//     }
//   });

//   return res.status(200).json({ loops: availableLoops });
// }

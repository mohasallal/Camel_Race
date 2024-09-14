// Example: PUT /api/events/[eventId]/updateLoop

import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const eventId = req.query.eventId as string;
      const loopData = JSON.parse(req.body);

      // Update the loop associated with the event
      const updatedLoop = await db.loop.update({
        where: { id: loopData.id },
        data: {
          ...loopData,
          event: { connect: { id: eventId } },
        },
      });

      res.status(200).json(updatedLoop);
    } catch (error) {
      res.status(500).json({ error: 'Error updating loop' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId, loopId } = req.query;

  if (req.method === 'GET') {
    try {
      const registeredCamels = await db.camelLoop.findMany({
        where: {
          loopId: String(loopId),
        },
        include: {
          camel: true, 
        },
      });

      res.status(200).json(registeredCamels.map(camelLoop => camelLoop.camel));
    } catch (error) {
      console.error('Error fetching registered camels:', error);
      res.status(500).json({ error: 'Error fetching registered camels' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

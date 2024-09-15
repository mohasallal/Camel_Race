import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { camelId } = await req.json();
    const url = new URL(req.url);
    const loopId = url.searchParams.get('loopId');

    console.log('Received camelId:', camelId);
    console.log('Received loopId:', loopId);

    if (!camelId || !loopId) {
      return NextResponse.json({ message: 'Invalid request parameters' }, { status: 400 });
    }

    const loop = await db.loop.findUnique({
      where: { id: loopId },
      select: { startRegister: true, endRegister: true },
    });

    if (!loop) {
      return NextResponse.json({ message: 'Loop not found' }, { status: 404 });
    }

    const currentTime = new Date();

    if (currentTime < loop.startRegister || currentTime > loop.endRegister) {
      return NextResponse.json({ message: 'Registration period has ended' }, { status: 403 });
    }

    const camelIdNumber = parseInt(camelId, 10);

    await db.camelLoop.deleteMany({
      where: {
        camelId: camelIdNumber,
        loopId: loopId,
      },
    });

    return NextResponse.json({ message: 'Camel removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing camel:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

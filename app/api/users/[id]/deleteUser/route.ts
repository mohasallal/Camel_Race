import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log('Received DELETE request'); // Log request receipt

  try {
    const { id } = params;

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.log('User not found');
      return new NextResponse('User not found', { status: 404 });
    }

    await db.user.delete({
      where: { id },
    });

    return new NextResponse('User deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Error deleting user', { status: 500 });
  }
}

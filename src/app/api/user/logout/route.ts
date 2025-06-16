import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  });

  return NextResponse.json({ message: 'Déconnecté' }, { status: 200 });
};

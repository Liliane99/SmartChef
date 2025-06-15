import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant dans les en-têtes.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded: { id?: string; email?: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return NextResponse.json(
        { error: 'Token invalide.' },
        { status: 401 }
      );
    }

    if (!decoded.id) {
      return NextResponse.json(
        { error: "ID utilisateur non trouvé dans le token." },
        { status: 401 }
      );
    }

    
    const userRes = await fetch(
      `http://localhost:3000/api/user/${decoded.id}/findById`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!userRes.ok) {
      const err = await userRes.json();
      return NextResponse.json({ error: err }, { status: userRes.status });
    }

    const user = await userRes.json();
    return NextResponse.json(user, { status: 200 });

  } catch (err) {
    console.error('Erreur dans /api/me :', err);
    return NextResponse.json(
      { error: 'Erreur serveur interne.' },
      { status: 500 }
    );
  }
}

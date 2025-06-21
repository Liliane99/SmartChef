import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'


//-------------------Server Side----------------------------------
const JWT_SECRET = process.env.JWT_SECRET!

export function getUserFromRequest(req: NextRequest): { id?: string; email?: string; username?: string } | null {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; username?: string }
    return decoded
  } catch {
    return null;
  }
}


//-------------------Client Side----------------------------------
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  
  return match ? decodeURIComponent(match[2]) : null;
};

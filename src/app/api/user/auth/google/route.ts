// app/api/user/login/google/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER, JWT_SECRET } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization header missing or malformed" }, { status: 401 });
    }

    const idToken = authHeader.replace("Bearer ", "");
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    if (!email) {
      return NextResponse.json({ error: "Email not found in token" }, { status: 400 });
    }

    const res = await fetch(`${AIRTABLE_API_URL}?filterByFormula=({email}="${email}")`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const data = await res.json();
    let user = data.records[0];

    
    if (!user) {
      const createRes = await fetch(AIRTABLE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            email,
            name,
            authProvider: "google",
          },
        }),
      });

      const createdData = await createRes.json();
      user = createdData;
    }

    const token = jwt.sign(
      { id: user.id, email: user.fields.email },
      JWT_SECRET!,
      { expiresIn: "24h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: "Google login successful", token });
  } catch (error: any) {
    console.error("[GOOGLE LOGIN ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

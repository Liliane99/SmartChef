import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";
import jwt from "jsonwebtoken";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER, JWT_SECRET } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const idToken = authHeader.replace("Bearer ", "");
    const decodedToken = await getAuth().verifyIdToken(idToken);

    const { email, name, firebase } = decodedToken;

    let provider = "custom";
    if (firebase?.sign_in_provider === "google.com") {
      provider = "google";
    }

    const checkRes = await fetch(`${AIRTABLE_API_URL}?filterByFormula=({email}="${email}")`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    const checkData = await checkRes.json();

    if (checkData.records.length > 0) {
      const record = checkData.records[0];
      const token = jwt.sign(
        { id: record.id, email: record.fields.email, username: record.fields.username },
        JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      return NextResponse.json({ token });
    }

    const createRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          email,
          username: name || email,
          provider,
        },
      }),
    });

    const createdUser = await createRes.json();

    if (!createRes.ok) {
      console.error("Erreur création Airtable:", createdUser);
      return NextResponse.json({ error: "Erreur création utilisateur" }, { status: 500 });
    }

    const token = jwt.sign(
      { id: createdUser.id, email, username: name || email },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token });

  } catch (error) {
    console.error("Google Register Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement Google" }, { status: 500 });
  }
}

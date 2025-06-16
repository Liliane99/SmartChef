import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER, JWT_SECRET } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;
const AIRTABLE_ALLERGY_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/allergy`;

export async function POST(request: Request) {
  try {
    const { email, password, username, intolerances } = await request.json();

    if (!email || !password || !username) {
      const token = jwt.sign(
        { email, username },
        JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      return NextResponse.json(
        { error: "Email, password and username are required" },
        { status: 400 }
      );
    }

    
    const checkRes = await fetch(`${AIRTABLE_API_URL}?filterByFormula=({email}="${email}")`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const checkData = await checkRes.json();

    if (checkData.records.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    let intoleranceIds: string[] = [];

    if (Array.isArray(intolerances) && intolerances.length > 0) {
      const allergyRes = await fetch(AIRTABLE_ALLERGY_URL, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      const allergyData = await allergyRes.json();

      intoleranceIds = allergyData.records
        .filter((record: { fields: { label: string }; id: string }) => intolerances.includes(record.fields.label))
        .map((record: { fields: { label: string }; id: string }) => record.id);
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
          username,
          password: hashedPassword,
          intolerances: intoleranceIds,
        },
      }),
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      return NextResponse.json({ error: errorData }, { status: createRes.status });
    }

    const createdUser = await createRes.json();

    const token = jwt.sign(
      { id: createdUser.id, email, username },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "User registered successfully", userId: createdUser.id, token },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

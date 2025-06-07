import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password and username are required" }, { status: 400 });
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
        },
      }),
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      return NextResponse.json({ error: errorData }, { status: createRes.status });
    }

    const createdUser = await createRes.json();

    return NextResponse.json({ message: "User registered successfully", userId: createdUser.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

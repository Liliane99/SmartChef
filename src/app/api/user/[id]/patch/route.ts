import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER } = process.env;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();

  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_USER) {
      throw new Error("API keys or base ID are not defined in environment variables");
    }

    const fields: Record<string, any> = {};

    if (body.username) {
      fields.username = body.username;
    }

    if (body.email) {
      fields.email = body.email;
    }

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      fields.password = hashedPassword;
    }

    if (Array.isArray(body.intolerances)) {
      fields.intolerances = body.intolerances;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const airtableRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!airtableRes.ok) {
      const errorData = await airtableRes.json();
      console.error("Erreur Airtable:", errorData);
      return NextResponse.json({ error: errorData }, { status: airtableRes.status });
    }

    const updatedUser = await airtableRes.json();
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

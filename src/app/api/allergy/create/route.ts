import { NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ALLERGY } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ALLERGY}`;

export async function POST(request: Request) {
  try {
    const { label } = await request.json();

    if (!label) {
      return NextResponse.json({ error: "Label field is required" }, { status: 400 });
    }

    
    const checkRes = await fetch(`${AIRTABLE_API_URL}?filterByFormula=({label}="${label}")`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const checkData = await checkRes.json();

    if (checkData.records.length > 0) {
      return NextResponse.json({ error: "Allergy already exists" }, { status: 409 });
    }

    
    const createRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          label
        },
      }),
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      return NextResponse.json({ error: errorData }, { status: createRes.status });
    }

    const createdAllergy = await createRes.json();

    return NextResponse.json({ message: "Allergy creted successfully", userId: createdAllergy.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

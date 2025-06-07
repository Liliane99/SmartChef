import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ALLERGY } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ALLERGY}`;


export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();

  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ALLERGY) {
      throw new Error("API keys or base ID are not defined in environment variables");
    }

    
    if (!body.label) {
      return NextResponse.json(
        { error: "This field can't be changed" },
        { status: 400 }
      );
    }

    const fields = { label: body.label };

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

    const data = await airtableRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}



  

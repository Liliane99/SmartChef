import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ALLERGY } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ALLERGY}`;

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ALLERGY) {
      throw new Error("API keys or base ID are not defined in environment variables");
    }

    const airtableRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!airtableRes.ok) {
      const errorData = await airtableRes.json();
      return NextResponse.json({ error: errorData }, { status: airtableRes.status });
    }

    return NextResponse.json({ message: "Allergy deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
  

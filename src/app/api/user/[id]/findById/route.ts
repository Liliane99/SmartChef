import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}`;


export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
  
    try {
      const airtableRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });
  
      if (!airtableRes.ok) {
        const errorData = await airtableRes.json();
        return NextResponse.json({ error: errorData }, { status: airtableRes.status });
      }
  
      const data = await airtableRes.json();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }
  }


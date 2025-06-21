import { mapAirtableRecipe } from "@/lib/mappers/mapAirtableRecipe";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const res = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    
    const publishedRecipe = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: publishedRecipe }, { status: res.status });
    }

    if (publishedRecipe.fields?.isPublished === 'false') {
      return NextResponse.json({ error: "Recipe is not public." }, { status: 403 });
    }

    const mappedRecipe = mapAirtableRecipe(publishedRecipe.fields);

    return NextResponse.json(mappedRecipe, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching recipe" }, { status: 500 });
  }
}

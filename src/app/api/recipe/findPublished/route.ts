import { mapAirtableRecipe } from "@/lib/mappers/mapAirtableRecipe";
import { AirtableRecipe } from "@/types/airtable";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function GET(req: NextRequest) {
  try {
    const filter = encodeURIComponent(`isPublished = 'true'`);
    const url = `${AIRTABLE_API_URL}?filterByFormula=${filter}`;

    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const publishedRecipes = await airtableRes.json();

    if (!airtableRes.ok) {
      return NextResponse.json({ error: publishedRecipes }, { status: airtableRes.status });
    }

    const mappedPublishedRecipes = publishedRecipes.records.map((recipe: { fields: AirtableRecipe; }) => {
      return mapAirtableRecipe(recipe.fields);
    })
    
    return NextResponse.json(mappedPublishedRecipes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching recipes" }, { status: 500 });
  }
}

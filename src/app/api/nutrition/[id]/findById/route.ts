import { getUserFromRequest } from "@/lib/auth";
import { mapAirtableNutrition } from "@/lib/mappers/mapAirtableNutrition";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NUTRITION, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NUTRITION}`;
const AIRTABLE_RECIPE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

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

    const nutrition = await airtableRes.json();
    const mappedNutrition = mapAirtableNutrition(nutrition.fields);

    const recipeId = nutrition.fields['id (from recipe)'];
    
    if (!recipeId) {
      return NextResponse.json({ error: "Nutrition doesn't have a linked recipe" }, { status: 400 });
    }

    const recipeRes = await fetch(`${AIRTABLE_RECIPE_URL}/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!recipeRes.ok) {
      const errorData = await recipeRes.json();
      return NextResponse.json({ error: errorData }, { status: recipeRes.status });
    }

    const recipeData = await recipeRes.json();
    const isPublished = recipeData.fields?.isPublished;

    const user = getUserFromRequest(req);
    if (!isPublished && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(mappedNutrition, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
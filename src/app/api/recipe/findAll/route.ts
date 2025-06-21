import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { mapAirtableRecipe } from "@/lib/mappers/mapAirtableRecipe";
import { AirtableRecipe } from "@/types/airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE, JWT_SECRET } = process.env;

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_RECIPE || !JWT_SECRET) {
      return NextResponse.json({ error: "Environment variables missing" }, { status: 500 });
    }

    const filterFormula = `user = '${user.id}'`;
    const encodedFormula = encodeURIComponent(filterFormula);
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodedFormula}`;

    const recipesRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    
    const recipes = await recipesRes.json();

    if (!recipesRes.ok) {
      return NextResponse.json({ error: "Failed to fetch recipes from Airtable" }, { status: recipesRes.status });
    }
    const mappedRecipes = recipes.records.map((recipe: { fields: AirtableRecipe; }) => {
      return mapAirtableRecipe(recipe.fields);
    })

    return NextResponse.json(mappedRecipes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

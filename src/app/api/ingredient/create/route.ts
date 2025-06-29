import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_INGREDIENT } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_INGREDIENT}`;

interface IngredientInput {
  name: string;
  quantity: number;
  unit?: string;
}

interface AirtableRecord {
  id: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { ingredients, recipeId }: { ingredients: IngredientInput[]; recipeId: string } = body;

  if (!ingredients || !Array.isArray(ingredients) || !recipeId) {
    return NextResponse.json({ error: 'Missing ingredients or recipeId' }, { status: 400 });
  }

  try {
    const ingredientRecords = ingredients.map((ingredient: IngredientInput) => ({
      fields: {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit || "",
        Recipe: [recipeId]
      }
    }));

    const airtableRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: ingredientRecords
      }),
    });

    const data: AirtableResponse = await airtableRes.json();

    if (!airtableRes.ok) {
      return NextResponse.json({ error: data }, { status: airtableRes.status });
    }

    const ingredientIds = data.records.map((record: AirtableRecord) => record.id);
    return NextResponse.json({ ingredientIds }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating ingredients" }, { status: 500 });
  }
}
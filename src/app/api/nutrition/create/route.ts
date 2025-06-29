import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NUTRITION } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NUTRITION}`;

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { nutrition, recipeId } = body;

  if (!nutrition || !recipeId) {
    return NextResponse.json({ error: 'Missing nutrition or recipeId' }, { status: 400 });
  }

  try {
    const airtableRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          calories: nutrition.calories || "0",
          proteins: nutrition.proteins || "0", 
          carbohydrates: nutrition.carbohydrates || "0",
          fats: nutrition.fats || "0",
          sugars: nutrition.sugars || "0",
          saturatedfats: nutrition.saturatedFats || "0",
          fibers: nutrition.fibers || "0",
          sodium: nutrition.sodium || "0",
          "id (from recipe)": [recipeId]
        },
      }),
    });

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      return NextResponse.json({ error: data }, { status: airtableRes.status });
    }

    return NextResponse.json({ nutritionId: data.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating nutrition" }, { status: 500 });
  }
}
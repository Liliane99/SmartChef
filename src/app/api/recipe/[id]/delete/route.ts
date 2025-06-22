import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = context.params;

  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_RECIPE) {
      throw new Error("API keys or base ID are not defined in environment variables");
    }

    const recipeRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    })

    const recipe = await recipeRes.json()
    if (recipe.fields?.user?.[0] !== user.id) {
      return NextResponse.json({ error: 'Access denied to this recipe' }, { status: 403 })
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

    return NextResponse.json({ message: "recipe deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
  

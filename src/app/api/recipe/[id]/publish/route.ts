import { getUserFromRequest } from "@/lib/auth"
import { mapAirtableRecipe } from "@/lib/mappers/mapAirtableRecipe";
import { NextRequest, NextResponse } from "next/server"

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json();
  const { isPublished } = body;

  if (typeof isPublished !== "boolean") {
    return NextResponse.json({ error: "Missing isPublished boolean" }, { status: 400 })
  }

  try {
    const recipeRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    })

    const recipe = await recipeRes.json()

    if (!recipeRes.ok || recipe.fields?.user?.[0] !== user.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    if (recipe.fields?.isPublished === isPublished) {
      return NextResponse.json({ message: `Already ${isPublished ? "published" : "unpublished"}` }, { status: 200 })
    }

    const airtableRes = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
           isPublished: isPublished ? "true" : "false",
        },
      }),
    })

    const data = await airtableRes.json()
    
    if (!airtableRes.ok) {
      return NextResponse.json({ error: data }, { status: airtableRes.status })
    }
    
    const mappedRecipe = mapAirtableRecipe(data.fields);

    return NextResponse.json(mappedRecipe, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

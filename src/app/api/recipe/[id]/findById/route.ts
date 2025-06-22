import { getUserFromRequest } from "@/lib/auth";
import { mapAirtableRecipe } from "@/lib/mappers/mapAirtableRecipe";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const user = getUserFromRequest(req);
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  
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
  
      const recipe = await airtableRes.json();

      if (recipe.fields?.user?.[0] !== user.id) {
        return NextResponse.json({ error: 'Recipe not accessible' }, { status: 403 })
      }

      const mappedRecipe = mapAirtableRecipe(recipe.fields);
      
      return NextResponse.json(mappedRecipe, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }
  }


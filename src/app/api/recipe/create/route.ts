import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const airtablePayload = {
      fields: {
        title: body.title,
        description: body.description,
        servings: body.servings,
        preparationTime: body.preparationTime,
        cookTime: body.cookTime,
        type: body.type,
        steps: Array.isArray(body.steps) 
          ? body.steps.map((step, index) => `${index + 1}. ${step}`).join('\n') 
          : body.steps,
        tags: body.tags,
        intolerances: body.intolerances.filter(Boolean), 
        image: body.image ? [{ url: body.image }] : [],
        isPublished: "false",
        createdAt: new Date().toISOString(),
        user: [user.id]
      },
      typecast: true
    };
    const airtableRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airtablePayload),
    });

    const recipeData = await airtableRes.json();

    if (!airtableRes.ok) {
      return NextResponse.json({ error: recipeData }, { status: airtableRes.status });
    }

    const recipeId = recipeData.id;
    let ingredientIds: string[] = [];
    if (body.ingredients && body.ingredients.length > 0) {
      const ingredientRes = await fetch(`${req.nextUrl.origin}/api/ingredient/create`, {
        method: "POST",
        headers: {
          Authorization: req.headers.get('authorization') || '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: body.ingredients,
          recipeId: recipeId
        }),
      });

      const ingredientData = await ingredientRes.json();

      if (ingredientRes.ok) {
        ingredientIds = ingredientData.ingredientIds;
      }
    }
    let nutritionId = '';
    if (body.nutrition) {
      const nutritionRes = await fetch(`${req.nextUrl.origin}/api/nutrition/create`, {
        method: "POST",
        headers: {
          Authorization: req.headers.get('authorization') || '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nutrition: body.nutrition,
          recipeId: recipeId
        }),
      });

      const nutritionData = await nutritionRes.json();

      if (nutritionRes.ok) {
        nutritionId = nutritionData.nutritionId;
      }
    }
    const updatePayload = {
      fields: {
        ingredients: ingredientIds,
        nutrition: nutritionId ? [nutritionId] : []
      },
    };

    const updateRes = await fetch(`${AIRTABLE_API_URL}/${recipeId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const updatedRecipe = await updateRes.json();

    if (!updateRes.ok) {
      return NextResponse.json({ error: updatedRecipe }, { status: updateRes.status });
    }

    return NextResponse.json({ id: recipeId }, { status: 201 });
  } catch (error) {
    console.error("ERREUR CATCH:", error);
    return NextResponse.json({ error: "Error creating recipe" }, { status: 500 });
  }
}
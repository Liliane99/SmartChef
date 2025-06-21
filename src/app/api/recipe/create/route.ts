import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_RECIPE } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_RECIPE}`;

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json();

  try {
    const airtableRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          title: body.title,
          description: body.description,
          serving: body.serving,
          nutrition: [body.nutrition],
          tags: body.tags,
          intolerances: body.intolerances,
          image: body.image,
          isPublished: false,
          createdAt: new Date().toISOString(),
          user: [user.id]
        },
      }),
    });

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      return NextResponse.json({ error: data }, { status: airtableRes.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating recipe" }, { status: 500 });
  }
}

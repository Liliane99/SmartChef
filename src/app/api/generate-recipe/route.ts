import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  const { ingredients } = await req.json();

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return NextResponse.json({ error: 'Aucun ingrédient fourni.' }, { status: 400 });
  }

  const prompt = `Crée une recette en français avec ces ingrédients : ${ingredients.join(', ')}. 
Inclue un titre, les ingrédients avec quantités, et les étapes.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'Tu es un chef cuisinier français.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Erreur OpenRouter:', data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    const recipe = data.choices?.[0]?.message?.content || 'Aucune réponse générée.';
    return NextResponse.json({ recipe });
  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json({ error: 'Erreur lors de la requête à OpenRouter.' }, { status: 500 });
  }
}

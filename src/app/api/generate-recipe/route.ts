import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_USER, JWT_SECRET } = process.env;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: { id?: string };

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET non défini');
    }

    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return NextResponse.json({ error: 'Token invalide.' }, { status: 401 });
    }

    if (!decoded.id) {
      return NextResponse.json({ error: "ID utilisateur manquant dans le token." }, { status: 401 });
    }


    const userUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_USER}/${decoded.id}`;
    const userRes = await fetch(userUrl, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return NextResponse.json({ error: err }, { status: userRes.status });
    }

    const userData = await userRes.json();

    const allergies = userData?.fields?.label_intolerances?.map((a: string) => a.toLowerCase()) || [];
  

    
    const body = await req.json();
    let { ingredients, portion, type, additionalAllergies } = body;

   

    if (!Array.isArray(ingredients) || ingredients.length === 0 || !portion || !type) {
      return NextResponse.json({ error: 'Paramètres invalides.' }, { status: 400 });
    }

    let extraAllergies: string[] = [];
    if (Array.isArray(additionalAllergies) && additionalAllergies.length > 0) {
      extraAllergies = additionalAllergies.map((a: string) => a.toLowerCase());
    }

    const totalAllergies = [...new Set([...allergies, ...extraAllergies])];
   

    
    const filteredIngredients = ingredients.filter(ingredient => {
      return !totalAllergies.includes(ingredient.toLowerCase());
    });

    

    if (filteredIngredients.length === 0) {
      return NextResponse.json({ error: 'Tous les ingrédients sont allergènes.' }, { status: 400 });
    }

   
    const prompt = `
Tu es un chef cuisinier français.
Crée une recette uniquement avec les ingrédients suivants : ${filteredIngredients.join(', ')}.
Le plat est une ${type}. Prépare la recette pour ${portion} personnes.
Les allergies à éviter sont : ${totalAllergies.join(', ')}.

En plus de la recette, calcule et indique les valeurs nutritionnelles suivantes pour l'ensemble de la recette (avec les unités) :
- calories (kcal)
- protéines (g)
- glucides (g)
- lipides (g)
- sucres (g)
- graisses saturées (g)
- fibres (g)
- sodium (mg)

Retourne uniquement un JSON strictement valide avec cette structure :
{
  "title": "Nom de la recette",
  "description": "Brève description",
  "type": "${type}",
  "ingredients": ["Liste des ingrédients utilisés"],
  "steps": ["Étape 1", "Étape 2", "..."],
  "servings": ${portion},
  "preparationTime": "Temps de préparation en minutes",
  "cookTime": "Temps de cuisson en minutes",
  "image": "URL d'une image",
  "tags": ["Origine", "Difficulté", "Végétarien ou Non", "Style"],
  "allergies": ["${totalAllergies.join('","')}"],
  "nutrition": {
    "calories": "xxx kcal",
    "proteins": "xx g",
    "carbohydrates": "xx g",
    "fats": "xx g",
    "sugars": "xx g",
    "saturatedFats": "xx g",
    "fibers": "xx g",
    "sodium": "xxx mg"
  }
}
Ne mets aucun texte avant ou après le JSON.
    `;

   

    
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

    const content = data.choices?.[0]?.message?.content;
    

    let recipe;

    try {
      recipe = JSON.parse(content);
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      return NextResponse.json({ error: 'Le modèle n’a pas généré un JSON valide.' }, { status: 500 });
    }

    recipe.ingredients = recipe.ingredients.filter((ing: string) => {
      return !totalAllergies.includes(ing.toLowerCase());
    });

    return NextResponse.json({ recipe }, { status: 200 });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}

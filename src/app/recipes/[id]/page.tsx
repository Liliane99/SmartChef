"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";

const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description: "Une recette italienne crémeuse et savoureuse à base de pancetta et parmesan.",
    image: "/images/carbonara.jpg",
    tags: ["Italien", "Pâtes", "Rapide"],
    steps: [
      "Faites cuire les pâtes al dente.",
      "Faites revenir la pancetta.",
      "Ajoutez les œufs et le parmesan hors du feu.",
      "Mélangez le tout avec les pâtes."
    ]
  },
  {
    id: 2,
    title: "Tacos au Poulet",
    description: "Des tacos croustillants garnis de poulet épicé, de salsa et d'avocat.",
    image: "/images/tacos.jpg",
    tags: ["Mexicain", "Street food"],
    steps: [
      "Cuire le poulet avec des épices.",
      "Préparer la salsa et les garnitures.",
      "Chauffer les tortillas.",
      "Assembler les tacos."
    ]
  },
  {
    id: 3,
    title: "Curry de Légumes",
    description: "Un curry végétarien riche en saveurs, parfait pour un repas réconfortant.",
    image: "/images/curry.jpg",
    tags: ["Vegan", "Épicé", "Confort food"],
    steps: [
      "Faire revenir les oignons, ail et gingembre.",
      "Ajouter les légumes et les épices.",
      "Ajouter lait de coco, mijoter 20min.",
      "Servir avec du riz basmati."
    ]
  }
];

export default function RecipeDetail() {
  const { id } = useParams();
  const recipeId = parseInt(id as string, 10);

  const recipe = useMemo(() => recipes.find((r) => r.id === recipeId), [recipeId]);

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-secondary">
        <p className="text-xl">Recette introuvable.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-6">{recipe.title}</h1>

        <div className="rounded-xl overflow-hidden mb-6 shadow-primary-lg">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        <p className="text-muted text-lg mb-6">{recipe.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="badge">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-secondary mb-4">Étapes de préparation</h2>
        <ol className="list-decimal list-inside space-y-3 text-muted">
          {recipe.steps.map((step, i) => (
            <li key={i} className="pl-1">{step}</li>
          ))}
        </ol>

        <div className="mt-10">
          <button
            className="btn-primary"
            onClick={() => history.back()}
          >
            ← Retour
          </button>
        </div>
      </main>
    </>
  );
}

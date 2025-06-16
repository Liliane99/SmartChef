"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description: "Une recette italienne crémeuse et savoureuse à base de pancetta et parmesan.",
    image: "/images/carbonara.jpg",
    tags: ["Italien", "Pâtes", "Rapide"]
  },
  {
    id: 2,
    title: "Tacos au Poulet",
    description: "Des tacos croustillants garnis de poulet épicé, de salsa et d'avocat.",
    image: "/images/tacos.jpg",
    tags: ["Mexicain", "Street food"]
  },
  {
    id: 3,
    title: "Curry de Légumes",
    description: "Un curry végétarien riche en saveurs, parfait pour un repas réconfortant.",
    image: "/images/curry.jpg",
    tags: ["Vegan", "Épicé", "Confort food"]
  },
];

export default function RecipesPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)));

  const filteredRecipes = activeTag
    ? recipes.filter(r => r.tags.includes(activeTag))
    : recipes;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary animate-fade-in-up mb-8 mt-10">
          Recettes à découvrir
        </h1>

        <div className="flex flex-wrap gap-3 mb-10">
          <button
            className={`badge ${!activeTag ? "badge-primary" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            Tous
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`badge transition-all duration-200 ${
                activeTag === tag ? "badge-primary" : ""
              }`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe, i) => (
            <Link
              href={`/recipes/${recipe.id}`}
              key={recipe.id}
              className="card animate-fade-in-up group relative overflow-hidden"
            >
              {i === 0 && (
                <div className="absolute top-4 left-4 badge badge-primary shadow-primary">
                  Nouveau
                </div>
              )}
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-2">
                {recipe.title}
              </h2>
              <p className="text-muted mb-4">{recipe.description}</p>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

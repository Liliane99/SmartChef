"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";

interface NutritionInfo {
  calories: number;
  proteins: number;
  carbohydrates: number;
  sugars: number;
  fats: number;
  saturatedFats: number;
  fiber: number;
  sodium: number;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  steps: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  nutrition: NutritionInfo;
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description: "Une recette italienne crémeuse et savoureuse à base de pancetta et parmesan.",
    image: "/images/carbonara.jpg",
    tags: ["Italien", "Pâtes", "Rapide"],
    servings: 4,
    prepTime: 10,
    cookTime: 15,
    nutrition: {
      calories: 520,
      proteins: 22,
      carbohydrates: 45,
      sugars: 3,
      fats: 28,
      saturatedFats: 12,
      fiber: 2,
      sodium: 680
    },
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
    servings: 2,
    prepTime: 20,
    cookTime: 15,
    nutrition: {
      calories: 380,
      proteins: 28,
      carbohydrates: 32,
      sugars: 5,
      fats: 18,
      saturatedFats: 6,
      fiber: 8,
      sodium: 520
    },
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
    servings: 4,
    prepTime: 15,
    cookTime: 25,
    nutrition: {
      calories: 280,
      proteins: 8,
      carbohydrates: 35,
      sugars: 12,
      fats: 14,
      saturatedFats: 10,
      fiber: 6,
      sodium: 420
    },
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
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-16 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-3">{recipe.title}</h1>
            <p className="text-muted text-lg lg:text-xl max-w-2xl">{recipe.description}</p>
          </div>
          <button
            className="btn-primary self-start lg:self-auto shrink-0"
            onClick={() => history.back()}
          >
            ← Retour aux recettes
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="badge">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="xl:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-primary-lg">
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={800}
                height={500}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>

            <div className="card p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-semibold text-secondary mb-6 flex items-center">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Étapes de préparation
              </h2>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex items-start group">
                    <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-primary text-white rounded-full flex items-center justify-center text-sm lg:text-base font-semibold mr-4 lg:mr-6 mt-1 group-hover:scale-110 transition-transform duration-200">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-muted text-base lg:text-lg leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne sticky (sidebar infos + nutrition) */}
          <div className="xl:col-span-1 space-y-6 sticky top-6 h-fit self-start">
            {/* Infos générales */}
            <div className="card p-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informations
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/15 to-primary/8 rounded-xl p-5 border border-primary/20 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-semibold">Portions</span>
                    <span className="text-3xl font-bold text-primary">{recipe.servings}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">personnes</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-blue-700 mb-1">{recipe.prepTime}</div>
                    <div className="text-sm text-blue-600 font-medium">min prep</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-orange-700 mb-1">{recipe.cookTime}</div>
                    <div className="text-sm text-orange-600 font-medium">min cuisson</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-700 font-semibold">Temps total</span>
                    <span className="text-xl font-bold text-secondary">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <div className="card p-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Nutrition
              </h3>
              <p className="text-sm text-gray-500 mb-6">Par portion</p>
              <div className="bg-gradient-to-r from-primary/25 to-primary/15 rounded-xl p-5 mb-6 text-center border border-primary/30 shadow-lg">
                <div className="text-4xl font-bold text-primary mb-2">{recipe.nutrition.calories}</div>
                <div className="text-sm font-semibold text-primary/80">kcal</div>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-6">
                {[
                  { label: "Protéines", value: recipe.nutrition.proteins, color: "blue" },
                  { label: "Glucides", value: recipe.nutrition.carbohydrates, color: "green" },
                  { label: "Lipides", value: recipe.nutrition.fats, color: "yellow" },
                  { label: "Sucres", value: recipe.nutrition.sugars, color: "pink" },
                ].map((item, idx) => (
                  <div className="text-center" key={idx}>
                    <div className={`w-18 h-18 mx-auto bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-full flex items-center justify-center mb-3 border-2 border-${item.color}-300 shadow-md hover:scale-105 transition-transform`}>
                      <div>
                        <div className={`text-lg font-bold text-${item.color}-700`}>{item.value}</div>
                        <div className={`text-xs text-${item.color}-600 font-medium`}>g</div>
                      </div>
                    </div>
                    <div className={`text-xs text-${item.color}-600 font-semibold`}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm font-medium">Graisses saturées</span>
                  <span className="font-semibold text-sm text-gray-800">{recipe.nutrition.saturatedFats}g</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm font-medium">Fibres</span>
                  <span className="font-semibold text-sm text-gray-800">{recipe.nutrition.fiber}g</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 text-sm font-medium">Sodium</span>
                  <span className="font-semibold text-sm text-gray-800">{recipe.nutrition.sodium}mg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

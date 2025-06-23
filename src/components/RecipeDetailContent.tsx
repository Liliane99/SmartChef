"use client";

import { formatDate, formatDuration } from "@/lib/format";
import { Ingredient, Nutrition, Recipe } from "@/types";
import { Badge } from "./ui/badge";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Props {
  recipe: Recipe;
  nutrition: Nutrition;
  ingredients: Ingredient[]
}

export default function RecipeDetailContent({ recipe, nutrition, ingredients }: Props) {
  const fallbackImage = "/fallback-image.jpg";
  const [imgSrc, setImgSrc] = useState(recipe.image);
  
  return (
    <main>
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.tags?.map((tag, index) => (
          <span key={index} className="badge">
            {tag}
          </span>
        ))}
      </div>

      <div className="text-muted text-sm mb-8">
        Type : <span className="font-medium text-secondary">{recipe.type}</span> • Créée le{" "}
        <span className="font-medium text-secondary">
            {formatDate(recipe.createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 space-y-8">
          <div className="text-right">
            <div className="rounded-2xl overflow-hidden shadow-primary-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt="dish image"
                  width={800}
                  height={500}
                  className="w-full h-64 lg:h-96 object-cover"
                  onError={() => setImgSrc(fallbackImage)}
                />
              </div>
            {imgSrc === fallbackImage && (
              <p className="text-sm text-muted">Image originale indisponible. Image par défaut utilisée.</p>
            )}
          </div>

          <div className="card p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary mb-6 flex items-center">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" />
              </svg>
              Ingrédients
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted text-base lg:text-lg">
              {ingredients.map((ingredient, i) => (
                <li key={i}>
                  {ingredient.quantity}{" "}
                  {ingredient.unit ? ingredient.unit : ""}{" "}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary mb-6 flex items-center">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Étapes de préparation
            </h2>
            <div className="space-y-6">
              {recipe.steps?.map((step, i) => (
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

        <div className="xl:col-span-1 space-y-6 sticky top-6 h-fit self-start">

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
                  <div className="text-2xl font-bold text-blue-700 mb-1">{formatDuration(recipe.preparationTime)}</div>
                  <div className="text-sm text-blue-600 font-medium"> de prep</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-orange-700 mb-1">{formatDuration(recipe.cookTime)}</div>
                  <div className="text-sm text-orange-600 font-medium"> de cuisson</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-700 font-semibold">Temps total</span>
                  <span className="text-xl font-bold text-secondary">{formatDuration(recipe.cookTime + recipe.preparationTime)}</span>
                </div>
              </div>
            </div>
          </div>
                    
          <div className="card p-6">
            <h3 className="text-xl lg:text-2xl font-semibold text-primary mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-primary" />
              Intolérances
            </h3>
            <div className="space-y-4">
              {recipe.intolerances.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recipe.intolerances.map((intol, idx) => (
                    <Badge variant="outline" key={idx} className="text-sm">
                      {intol}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">Aucune intolérance spécifiée.</p>
              )}

            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl lg:text-2xl font-semibold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Nutrition
            </h3>
            <p className="text-sm text-gray-500 mb-6">Par portion</p>
            <div className="bg-gradient-to-r from-primary/25 to-primary/15 rounded-xl p-5 mb-6 text-center border border-primary/30 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">{nutrition.calories}</div>
              <div className="text-sm font-semibold text-primary/80"></div>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-6">
              {[
                { label: "Protéines", value: nutrition.proteins, color: "blue" },
                { label: "Glucides", value: nutrition.carbohydrates, color: "green" },
                { label: "Lipides", value: nutrition.fats, color: "yellow" },
                { label: "Sucres", value: nutrition.sugars, color: "pink" },
              ].map((item, idx) => (
                <div className="text-center" key={idx}>
                  <div className={`w-18 h-18 mx-auto bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-full flex items-center justify-center mb-3 border-2 border-${item.color}-300 shadow-md hover:scale-105 transition-transform`}>
                    <div>
                      <div className={`text-lg font-bold text-${item.color}-700`}>{item.value}</div>
                      <div className={`text-xs text-${item.color}-600 font-medium`}></div>
                    </div>
                  </div>
                  <div className={`text-xs text-${item.color}-600 font-semibold`}>{item.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 text-sm font-medium">Graisses saturées</span>
                <span className="font-semibold text-sm text-gray-800">{nutrition.saturatedFats}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 text-sm font-medium">Fibres</span>
                <span className="font-semibold text-sm text-gray-800">{nutrition.fibers}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 text-sm font-medium">Sodium</span>
                <span className="font-semibold text-sm text-gray-800">{nutrition.sodium}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

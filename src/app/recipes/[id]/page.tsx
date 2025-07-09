"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import RecipeDetailContent from "@/components/RecipeDetailContent";
import Loader from "@/components/Loader";
import { useAlert } from "@/components/AlertContext";
import { Ingredient, Nutrition, Recipe } from "@/types";

export default function RecipeDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const fetchIngredients = async (ids: string[]): Promise<Ingredient[]> => {
            try {
                const ingredientPromises = ids.map(ingredientId => 
                    fetch(`/api/ingredient/${ingredientId}/findById`).then(res => {
                        if (!res.ok) throw new Error("Failed to fetch ingredient");
                        return res.json();
                    })
                );
                
                return await Promise.all(ingredientPromises);
            } catch (err) {
                console.error("Error retrieving ingredients:", err);
                return [];
            }
        } 

        const fetchNutrition = async (nutritionId: string): Promise<Nutrition> => {
            try {
                const res = await fetch(`/api/nutrition/${nutritionId}/findById`);
                
                if (!res.ok) throw new Error("Recovery failed");
                return await res.json();
            } catch (err) {
                console.error("Nutrition recovery error:", err);
                return {
                    calories: '0',
                    proteins: '0',
                    carbohydrates: '0',
                    sugars: '0',
                    fats: '0',
                    saturatedFats: '0',
                    fibers: '0',
                    sodium: '0'
                };
            }
        }
        
        const fetchRecipe = async () => {
          try {
              const res = await fetch(`/api/recipe/findPublished/${id}`);

              if (!res.ok) throw new Error("La recette n'a pas pu être récupérée");
              const recipeData = await res.json();

              const [ingredients, nutrition] = await Promise.all([
                recipeData.ingredientsId && recipeData.ingredientsId.length > 0 
                    ? fetchIngredients(recipeData.ingredientsId)
                    : [],
                recipeData.nutritionId && recipeData.nutritionId.length > 0
                    ? fetchNutrition(recipeData.nutritionId[0])
                    : {
                        calories: 0,
                        proteins: 0,
                        carbohydrates: 0,
                        sugars: 0,
                        fats: 0,
                        saturatedFats: 0,
                        fibers: 0,
                        sodium: 0
                    }
              ]);
    
              const completeRecipe: Recipe = {
                  ...recipeData,
                  ingredients: ingredients,
                  nutrition: nutrition
              };              
              setRecipe(completeRecipe);

          } catch (err) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              showAlert({
                  type: "error",
                  title: "Erreur",
                  description: errorMessage
              })
          } finally {
              setIsLoading(false);
          }
        };
        
        fetchRecipe();
    }, [id, showAlert, , router]);


  if (isLoading) return <div className="text-center p-10"> <Loader/></div>;
  
  if (!recipe) {
      return (
          <>
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 py-20 text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">Recette introuvable</h2>
              <p className="text-gray-600 mb-6">La recette demandée n&apos;a pas été trouvée ou a été supprimée.</p>
              <button
              className="btn-secondary"
              onClick={() => router.push("/recipes")}
              >
              ← Retour aux recettes
              </button>
          </main>
          </>
      );
  }
  return (
    <>
      <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 mt-10 lg:py-16 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-3">{recipe.title}</h1>
                    <p className="text-muted text-lg lg:text-xl max-w-2xl">{recipe.description}</p>
                </div>
                <button
                    className="btn-primary self-start lg:self-auto shrink-0"
                    onClick={() => router.push('/recipes')}
                >
                    ← Retour aux recettes
                </button>
            </div>
            <RecipeDetailContent 
                recipe={recipe} 
                nutrition={recipe.nutrition} 
                ingredients={recipe.ingredients} 
            />
      </main>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Loader from "@/components/Loader";
import RecipeForm, { SubmitData } from "@/components/RecipeForm";
import RecipeRecap from "@/components/RecipeRecap";
import RecipeDetailContent from "@/components/RecipeDetailContent";
import { Ingredient, IntoleranceSelection, Recipe } from "@/types";
import { useAlert } from "@/components/AlertContext";
import { getCookie } from "@/lib/auth";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { RotateCcw, Save } from "lucide-react";

export default function RecipeGenerationPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [formData, setFormData] = useState<SubmitData>({
    type: '',
    ingredients: [],
    servings: 1,
    intolerances: [] 
  });
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [intoleranceSuggestions, setIntoleranceSuggestions] = useState<IntoleranceSelection[]>([]);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    const tokenFromCookie = getCookie("token");     
    
    if (!tokenFromCookie) {
        window.location.href = "/login";
        return;
    }
    setToken(tokenFromCookie);
  }, []);

  useEffect(() => {
    if (!token || hasError) return;
    const fetchIntolerances = async () => {
        try {
            const res = await fetch("/api/allergy/findAll", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            
            const mapped = data.users.map((item: { fields: { id: string; label: string; }; }) => ({
                id: item.fields.id,
                label: item.fields.label,
            }));

            setIntoleranceSuggestions(mapped);

        } catch (error) {
            console.error("Intolerance recovery error", error);
            setHasError(true);
        }
    };
    
    fetchIntolerances();
  }, [hasError, token]);


  const handleGenerate = async (data: SubmitData) => {
    try {
        const formattedData = {
            type: data.type,
            ingredients: data.ingredients,
            portion: data.servings,
            intolerances: data.intolerances.map((intolerance: IntoleranceSelection) => intolerance.id),
        };

        setFormData(data);
        setStep("loading");

        const res = await fetch("/api/generate-recipe", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
          body: JSON.stringify(formattedData),
        });

        const generatedRecipe = await res.json();
        
        const mappedRecipe = mapJsonToRecipeObject(generatedRecipe);

        setRecipe(mappedRecipe);
        setStep("result");

    } catch (error) {
        console.error(error);
        showAlert({
            type: "error",
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération de recette."
        })
    }
  };

  const createRecipe = async (ingredientsId: string[], nutritionId: string) => {
    const recipePayload = {
        ...recipe,
        ingredients: ingredientsId,
        nutrition: nutritionId
    };

    const res = await fetch("/api/recipe/create", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
     },
      body: JSON.stringify(recipePayload),
    });
    const saved = await res.json();

    return saved.id;
  }

  const handleSave = async () => {
    try {
        if (!recipe) return;
    
        // const ingredientsId: string[] = await createIngredients();
        // const nutritionId: string = await createNutrition();
    
        const ingredientsId = ['', ''];
        const nutritionId = '';
    
        const recipeId = await createRecipe(ingredientsId, nutritionId);
        
        showAlert({
            type: "success",
            title: "Créer",
            description: "La recette a bien été créée, vous serez redirigés."
        })
        
        setTimeout(()=>{
          router.push(`/history-recipes/${recipeId}`);
        }, 2000)

    } catch (error) {
        console.error(error);
        showAlert({
            type: "error",
            title: "Erreur",
            description: "Une erreur est survenue lors de la création de la recette."
        })
    }
  };

  const mapJsonToRecipeObject = (generatedRecipe): Recipe => {
    const ingredientsParsed = generatedRecipe.ingredients.map((ing: Ingredient) => ({
      name: ing.name,
      quantity: Number(ing.quantity), 
      unit: ing.unit || undefined, 
    }));
    
    const recipe: Recipe = {
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        image: generatedRecipe.image,
        tags: generatedRecipe.tags,
        ingredients: ingredientsParsed,
        steps: generatedRecipe.steps,
        servings: generatedRecipe.servings,
        preparationTime: generatedRecipe.preparationTime,
        cookTime: generatedRecipe.cookTime,
        nutrition: generatedRecipe.nutrition,
        type: generatedRecipe.type,
        intolerances: generatedRecipe.intolerances,
        createdAt: new Date()
    }
    return recipe;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 mt-10">
        { step === "form" && (
            <RecipeForm 
                onSubmit={handleGenerate}
                intoleranceSuggestions={intoleranceSuggestions}
             />
        )}

        {step === "loading" && (
          <div className="text-center py-20">
            <Loader />
            <p className="mt-4 text-gray-500 text-lg animate-pulse">Génération de votre recette en cours...</p>
          </div>
        )}

        {step === "result" && recipe && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex flex-wrap gap-4 mt-6">
                    <button className="btn-primary flex items-center gap-2" onClick={handleSave}>
                          <Save className="w-4 h-4" />
                          Enregistrer la recette
                    </button>
                    <button className="btn-secondary flex items-center gap-2" onClick={() => handleGenerate(formData)}>
                      <RotateCcw className="w-4 h-4" />
                      Générer une nouvelle recette
                    </button>                  
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                      className="btn-primary self-start lg:self-auto shrink-0"
                      onClick={() => setStep("form")}
                  >
                      ← Retour au formulaire
                  </button>
                </div>
            </div>
            <RecipeRecap  data={formData} />

            <Card className="bg-white p-4">
              <CardTitle className="text-xl lg:text-2xl font-bold text-primary">{recipe.title}</CardTitle>
              <CardDescription className="text-muted text-m lg:text-l max-w-2xl">{recipe.description}</CardDescription>
              <RecipeDetailContent recipe={recipe} nutrition={recipe.nutrition} ingredients={recipe.ingredients}  />
            </Card>
          </>
        )}
      </main>
    </>
  );
}

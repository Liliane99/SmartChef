"use client";
import Navbar from "@/components/navbar";
import RecipeDetailContent from "@/components/RecipeDetailContent";
import { getCookie } from "@/lib/auth";
import { Ingredient, Nutrition, Recipe } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { useAlert } from "@/components/AlertContext";
import Loader from "@/components/Loader";

export default function Page() {
    const router = useRouter();
    const { id } = useParams();
    const { showAlert } = useAlert();

    const [token, setToken] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [nutrition, setNutrition] = useState<Nutrition | null>(null);

    useEffect(() => {
        const tokenFromCookie = getCookie("token");     
        
        if (!tokenFromCookie) {
            window.location.href = "/login";
            return;
        }
        setToken(tokenFromCookie);
    }, []);

    useEffect(() => {
        if (!token || !id) return;
        if(hasError) {
            setTimeout(() => {
                router.push("/history-recipes");
            }, 2000);
            return;
        }

        const fetchIngredients = async (id: string) => {
            try {
                // const res = await fetch(`/api/ingredient/${id}/findById`, {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                // if (!res.ok) throw new Error("Recovery failed");
                // const data = await res.json();
                // setIngredients((prev: Ingredient[]) => [...prev, data]);
                setIngredients([
                    {name: "Tomate", quantity: 5},
                    {name: "Sucre", quantity: 20, unit: 'g'}
                ])
            } catch (err) {
                console.error("Error retrieving ingredients:", err);
                setHasError(true);
            }
        } 

        const fetchNutrition = async (id: string) => {
            try {
                // const res = await fetch(`/api/nutrition/${id}/findById`, {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                // if (!res.ok) throw new Error("Recovery failed");
                // const data = await res.json();
                //setNutrition(data);
                setNutrition({
                        calories: 520,
                        proteins: 22,
                        carbohydrates: 45,
                        sugars: 3,
                        fats: 28,
                        saturatedFats: 12,
                        fiber: 2,
                        sodium: 680
                        })
            } catch (err) {
                console.error("Nutrition recovery error:", err);
                setHasError(true);
            }
        }

        const fetchRecipe = async () => {
            try {
                const res = await fetch(`/api/recipe/${id}/findById`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("La recette n'a pas pu être récupérée");
                const data = await res.json();
                setRecipe(data);

                await Promise.all([
                    fetchNutrition(data.nutritionId),
                    Promise.all(
                        data.ingredientsId.map((id: string) => fetchIngredients(id))
                    )
                ]);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                showAlert({
                    type: "error",
                    title: "Erreur",
                    description: errorMessage
                })
                setHasError(true);
            }
        };
        fetchRecipe();
    }, [token, id, showAlert, hasError, router]);


    const deleteRecipe = async () => {
        const confirm = window.confirm("Voulez-vous supprimer cette recette ?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/recipe/${recipe?.id}/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                showAlert({
                    type: "success",
                    title: "Effectuée",
                    description: "La recette a été supprimée.",
                })

                router.push("/history-recipes");
            } else {
                throw new Error("Error deleting.");
            }
        } catch (err) {
            console.error(err);
            showAlert({
                type: "error",
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression"
            })
        }
    };

    const handlePublication = async () => {
        try {
        const res = await fetch(`/api/recipe/${recipe?.id}/publish`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ isPublished: !recipe?.isPublished }),
        });

        if (res.ok) {
            const updated = await res.json();
            setRecipe(updated);
            showAlert({
                type: "success",
                title: updated.isPublished ? "Publiée" : "Dépubliée",
                description: updated.isPublished ? "La recette est public à présent." : "La recette est privée à présent.",
            })
        } else {
            throw new Error();
        }
        } catch (err) {
            console.error(err);
            showAlert({
                type: "error",
                title: "Erreur",
                description: recipe?.isPublished ? "Une erreur est survenue lors de la publication" : "Une erreur est survenue lors de la déplication"
            })
        }
    };

    if (!recipe || !nutrition || !ingredients.length) return <p className="text-center p-10"> <Loader/></p>;

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
                    onClick={() => router.push('/history-recipes')}
                >
                    ← Retour aux recettes
                </button>
            </div>
            <RecipeDetailContent recipe={recipe} nutrition={nutrition} ingredients={ingredients} />

            <div className="flex justify-center flex-row gap-4 mt-10">
                <ConfirmModal
                    title={recipe.isPublished ? "Souhaitez-vous dépublier la recette ?" : "Souhaitez-vous publier la recette ?"}
                    description={recipe.isPublished ? "Elle ne sera plus visible publiquement." : "Elle sera visible pour tous."}
                    confirmLabel={recipe.isPublished ? "Dépublier" : "Publier"}
                    onConfirm={handlePublication}
                    trigger={
                        <button className="btn-secondary w-full text-center">       
                            {recipe.isPublished ? "Dépublier" : "Publier"}
                        </button>
                    }
                />

                <ConfirmModal
                    title="Êtes-vous sûrs de supprimer la recette ?"
                    description="Cette action est irréversible."
                    confirmLabel="Supprimer"
                    onConfirm={deleteRecipe}
                    trigger={<button className="btn-primary min-w-[130px] text-center">Supprimer</button>}
                />
            </div>
      </main>
    </>
  );
}

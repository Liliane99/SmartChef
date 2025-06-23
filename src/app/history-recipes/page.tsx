"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Recipe } from "@/types";
import { getCookie } from "@/lib/auth";
import { useAlert } from "@/components/AlertContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function RecipesPage() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activePublication, setActivePublication] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)));
  const allTypes = Array.from(new Set(recipes.map(r => r.type)));

  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {

    const token = getCookie("token");     
            
    if (!token) {
        window.location.href = "/login";
        return;
    }

    if(hasError) {
        setTimeout(() => {
            router.push("/history-recipes");
        }, 2000);
        return;
    }

    const fetchRecipes = async () => {
        try {
            const res = await fetch(`/api/recipe/findAll`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!res.ok) throw new Error("La recette n'a pas pu être récupérée");
            const data = await res.json();
            setRecipes(data);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            showAlert({
                type: "error",
                title: "Erreur",
                description: errorMessage
            })
            setHasError(true);
        } finally {
          setIsLoading(false);
        }
    };

    fetchRecipes();
  }, [hasError, router, showAlert])


  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(recipe => {
        const titleMatch = recipe.title.toLowerCase().includes(query);
        const descriptionMatch = recipe.description.toLowerCase().includes(query);
        const sameServings = recipe.servings === Number(query);

        const tagMatch = recipe.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        
        return titleMatch || tagMatch || descriptionMatch || sameServings;
      });
    }
    
    if (activeTags.length > 0) {
      filtered = filtered.filter(r =>
        activeTags.some(tag => r.tags.includes(tag))
      );
    }

    if (activePublication === "publiées") {
        filtered = filtered.filter(r => r.isPublished === true);
    }

    if (activePublication === "non publiées") {
        filtered = filtered.filter(r => r.isPublished === false);
    }

    if (activeType) {
      filtered = filtered.filter(r => r.type === activeType);
    }

    return filtered;
  }, [recipes, searchQuery, activeTags, activeType, activePublication]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTags([]);
    setActiveType(null);
    setActivePublication(null);
  };

  if (isLoading) return <div className="text-center p-10"><Loader/></div>;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 mt-10">
        <h1 className="text-4xl font-bold text-primary animate-fade-in-up mb-8 mt-10">
          Historique des recettes générées
        </h1>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-lg"
              placeholder="Rechercher par nom de recette, description ou nombre de personnes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          
          {(searchQuery || activeTags || activeType || activePublication) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Filtres actifs:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {searchQuery}
                </span>
              )}
              {activeTags.map(tag => (
                <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {activeType && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {activeType}
                </span>
              )}

              {activePublication && (
                <span className="bg-purple-100 text-orange-800 px-2 py-1 rounded">
                  {activePublication}
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800 underline ml-2"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}
        </div>

        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Type de plat</h3>
          <div className="flex flex-wrap gap-3">
            <button
              className={`badge ${!activeType ? "badge-primary" : ""}`}
              onClick={() => setActiveType(null)}
            >
              Tous les types
            </button>
            {allTypes.map((type) => (
              <button
                key={type}
                className={`badge transition-all duration-200 ${
                  activeType === type ? "badge-primary" : ""
                }`}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-10">
          <span className="text-lg font-semibold text-gray-700 mr-2">Catégories:</span>
          <button
            className={`badge ${!activeTags.length ? "badge-primary" : ""}`}
            onClick={() => setActiveTags([])}
          >
            Toutes
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`badge transition-all duration-200 ${
                activeTags.includes(tag) ? "badge-primary" : ""
              }`}
              onClick={() => {
                  setActiveTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                  );
              }}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mb-10">
            <span className="text-lg font-semibold text-gray-700 mr-2">Publication :</span>
            <button
                className={`badge ${!activePublication ? "badge-primary" : ""}`}
                onClick={() => setActivePublication(null)}
            >
                Toutes
            </button>
            <button
                className={`badge ${activePublication === "publiées" ? "badge-primary" : ""}`}
                onClick={() => setActivePublication("publiées")}
            >
                Publiées
            </button>
            <button
                className={`badge ${activePublication === "non publiées" ? "badge-primary" : ""}`}
                onClick={() => setActivePublication("non publiées")}
            >
                Non publiées
            </button>
        </div>

        
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.513-.832-6.212-2.207-.394-.319-.564-.769-.414-1.207L7.586 4.793A1 1 0 018.414 4.207l4.829 4.828a1 1 0 01.293.707v1.586a1 1 0 01-.293.707l-2.828 2.829a1 1 0 00-.293.707v3.172a1 1 0 01-.293.707z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recette trouvée</h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou de supprimer les filtres.
            </p>
          </div>
        ) : (
        <div className="flex flex-col gap-6">
            {filteredRecipes.map((recipe) => (
              <Link
                href={`/history-recipes/${recipe.id}`}
                key={recipe.id}
                className="card w-full animate-fade-in-up group relative overflow-hidden"
                >
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                    {recipe.isPublished ? "Publiée" : "Non publiée"}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-1/3 overflow-hidden rounded-lg">
                        <Image
                            src={recipe.image}
                            alt={recipe.title}
                            width={800}
                            height={500}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                    </div>

                    <div className="flex-1 text-left">
                        <h2 className="text-2xl font-semibold text-primary mb-2">{recipe.title}</h2>
                        <p className="text-muted mb-2">{recipe.description}</p>

                        <p>
                            <span className="text-xs text-gray-500 mr-2">Type:</span>
                            <span className="text-sm text-gray-700"> {recipe.type}</span>
                        </p>

                        <p className="mb-3" >
                            <span className="text-xs text-gray-500 mr-2">Nombre de personne(s):</span>
                            <span className="text-sm text-gray-700"> {recipe.servings}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {recipe.tags.map((tag, index) => (
                            <span key={index} className="badge">
                                {tag}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
              </Link>
            ))}
        </div>
      )}

        <div className="mt-8 text-center text-gray-500">
            {filteredRecipes.length} recette{filteredRecipes.length !== 1 ? "s" : ""} trouvée{filteredRecipes.length !== 1 ? "s" : ""}
        </div>
     </main>
    </>
  );
}
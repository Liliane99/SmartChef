"use client";

import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import IntolerancesInput from "./IntolerancesInput";
import { IntoleranceSelection } from "@/types";
import { useAlert } from "./AlertContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface SubmitData {
    type: string;
    ingredients: string[];
    servings: number;
    intolerances: IntoleranceSelection[]
}

interface Props {
  onSubmit: (data: SubmitData) => void;
  intoleranceSuggestions: IntoleranceSelection[];
}

export default function RecipeForm({ onSubmit, intoleranceSuggestions }: Props) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState("");
  const [type, setType] = useState("");
  const [servings, setServings] = useState(1);
  const [intolerances, setIntolerances] = useState<IntoleranceSelection[]>([]);

  const { showAlert } = useAlert();

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredients(prev => [...prev, ingredient]);
      setIngredient("");
    }
  };

  const removeIngredient = (item: string) => {
    setIngredients(prev => prev.filter(i => i !== item));
  };

  const handleSubmit = () => {
    if (!type.trim() && type.length < 2 || ingredients.length === 0 || servings < 1) {
        showAlert({
            type: "error",
            title: "Erreur",
            description: "Un ou plusieurs champs sont vides ou/et invalides."
        })
        return;
    }
    onSubmit({ type, ingredients, servings, intolerances });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary animate-fade-in-up mb-8 mt-10">Générer une recette</h1>
      <Card className="shadow-lg border-0">

         <CardHeader>
            <CardTitle>Formulaire de recette</CardTitle>
            <CardDescription>Remplissez les champs ci-dessous afin que l&apos;IA vous génére une recette personnalisée !</CardDescription>
         </CardHeader>
         
         <Separator /> 
         
         <CardContent>
            <div className="mb-6">
                <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full border-secondary-300">
                    <SelectValue placeholder="Choisir un type de plat" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="entrée">Entrée</SelectItem>
                    <SelectItem value="plat">Plat</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="mb-6">
                <Label className="block text-sm font-medium mb-2">Ingrédients</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={ingredient}
                        onChange={(e) => setIngredient(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddIngredient();
                            }
                        }}
                        className="border-secondary-300"
                        placeholder="Ex: Poulet, Tomates..."
                    />
                    <Button
                        onClick={handleAddIngredient}
                        size="sm"
                        aria-label="Ajouter ingrédient"
                    >
                        <Plus size={20} />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {ingredients.map((ing, idx) => (
                        <span
                        key={idx}
                        className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium"
                        >
                            {ing}
                            <button
                                type="button"
                                onClick={() => removeIngredient(ing)}
                                className="ml-2 text-gray-500 hover:text-primary"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <Label className="block text-sm font-medium">Nombre de personnes</Label>
                <Input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="border-secondary-300"
                min={1}
                />
            </div>

            <div className="mb-6">
                <IntolerancesInput
                    selected={intolerances}
                    onChange={setIntolerances}
                    suggestions={intoleranceSuggestions ?? []}
                />
            </div>
            <div className="text-right">
                <Button
                    className="btn-primary mt-4 py-3 text-lg"
                    onClick={handleSubmit}
                >
                    <> <Sparkles  className="w-4 h-4 mr-2" /> Générer la recette </>
                </Button>
            </div>
         </CardContent>
     </Card>
    </div>
  );
}

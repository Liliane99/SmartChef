"use client";

import { SubmitData } from "./RecipeForm";

export default function RecipeRecap({ data }: { data: SubmitData }) {
  return (
    <div className=" border rounded-lg p-4 mb-8 shadow">
      <h3 className="text-xl font-semibold mb-3">Résumé de la demande</h3>
      <p><strong>Ingrédients :</strong> {data.ingredients.join(", ")}</p>
      <p><strong>Nombre de personnes :</strong> {data.servings}</p>
      <p>
        <strong>Intolérances :</strong>{" "}
        {data.intolerances.length > 0
          ? data.intolerances.map(i => i.label).join(", ")
          : "Aucune"}
      </p>
    </div>
  );
}

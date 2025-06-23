import { AirtableRecipe } from "@/types/airtable";

export function mapAirtableRecipe(airtableRecipe: AirtableRecipe) {
  return {
    id: airtableRecipe.id,
    title: airtableRecipe.title,
    description: airtableRecipe.description,
    image: airtableRecipe.image?.[0]?.url || "",
    tags: Array.isArray(airtableRecipe.tags)
      ? airtableRecipe.tags
      : JSON.parse(airtableRecipe.tags || "[]"),
    ingredientsId: airtableRecipe.ingredients,
    steps: Array.isArray(airtableRecipe.steps)
      ? airtableRecipe.steps
      : JSON.parse(airtableRecipe.steps || "[]"),
    servings: airtableRecipe.servings,
    preparationTime: airtableRecipe.preparationTime,
    cookTime: airtableRecipe.cookTime,
    type: airtableRecipe.type,
    createdAt: airtableRecipe.createdAt,
    isPublished: airtableRecipe.isPublished === "true" ? true : false,
    nutritionId: airtableRecipe.nutrition,
    userId: airtableRecipe.user,
    intolerances:  Array.isArray(airtableRecipe.intolerances)
      ? airtableRecipe.intolerances
      : JSON.parse(airtableRecipe.intolerances || "[]")
  };
}

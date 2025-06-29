import { AirtableNutrition } from "@/types/airtable";

export function mapAirtableNutrition(airtableNutrition: AirtableNutrition) {
  return {
    calories: airtableNutrition.calories || "0 kcal",
    proteins: airtableNutrition.proteins || "0 g",
    carbohydrates: airtableNutrition.carbohydrates || "0 g",
    fats: airtableNutrition.fats || "0 g",
    sugars: airtableNutrition.sugars || "0 g",
    saturatedFats: airtableNutrition.saturatedFats || "0 g",
    fibers: airtableNutrition.fibers || "0 g",
    sodium: airtableNutrition.sodium || "0 mg",
  };
}
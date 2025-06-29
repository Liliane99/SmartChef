import { AirtableNutrition } from "@/types/airtable";

export function mapAirtableNutrition(airtableNutrition: AirtableNutrition) {
  return {
    calories: parseInt(airtableNutrition.calories) || 0,
    proteins: parseInt(airtableNutrition.proteins) || 0,
    carbohydrates: parseInt(airtableNutrition.carbohydrates) || 0,
    fats: parseInt(airtableNutrition.fats) || 0,
    sugars: parseInt(airtableNutrition.sugars) || 0,
    saturatedFats: parseInt(airtableNutrition.saturatedfats) || 0,
    fibers: parseInt(airtableNutrition.fibers) || 0,
    sodium: parseInt(airtableNutrition.sodium) || 0,
  };
}
import { AirtableIngredient } from "@/types/airtable";

export function mapAirtableIngredient(airtableIngredient: AirtableIngredient) {
  return {
    id: airtableIngredient.id,
    name: airtableIngredient.name,
    quantity: airtableIngredient.quantity,
    unit: airtableIngredient.unit || "",
  };
}
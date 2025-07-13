type AirtableImage = {
  url: string;
};

export interface AirtableRecipe {
  id: string;
  user: string[];
  title: string;
  description: string;
  image: AirtableImage[];
  tags: string[];
  ingredients: string[];
  intolerances: string[];
  steps: string;
  servings: number;
  preparationTime: number;
  cookTime: number;
  nutrition: string[];
  type: string;
  createdAt: string;
  isPublished: string;
}

export interface AirtableIngredient {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  Recipe: string[];
}

export interface AirtableNutrition {
  id: string;
  calories: string;
  proteins: string;
  carbohydrates: string;
  fats: string;
  sugars: string;
  saturatedFats: string;  
  fibers: string;
  sodium: string;
  "id (from recipe)": string[];
}
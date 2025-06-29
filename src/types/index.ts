export interface Nutrition {
  calories: number;
  proteins: number;
  carbohydrates: number;
  sugars: number;
  fats: number;
  saturatedFats: number;
  fibers: number;
  sodium: number;
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  ingredients: Ingredient[];       
  intolerances: string[];
  steps: string[];
  servings: number;
  preparationTime: number;
  cookTime: number;
  nutrition: Nutrition;             
  type: string;
  createdAt: Date;
  isPublished?: boolean;
  ingredientsId?: string[];         
  nutritionId?: string[];
  userId?: string[];
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string;
}

export type IntoleranceSelection = { id: string; label: string };
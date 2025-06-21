export interface Nutrition {
  calories: number;
  proteins: number;
  carbohydrates: number;
  sugars: number;
  fats: number;
  saturatedFats: number;
  fiber: number;
  sodium: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  servings: number;
  preparationTime: number;
  cookTime: number;
  nutrition: Nutrition;
  type: string;
  createdAt: string;
  isPublished: boolean
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string;
}
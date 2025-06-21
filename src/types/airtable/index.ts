import { Nutrition } from "..";

type AirtableImage = {
  url: string;
};

export interface AirtableRecipe {
  id: number;
  user: string;
  title: string;
  description: string;
  image:AirtableImage[];
  tags: string[];
  ingredients: string;
  intolerances: string;
  "label (from intolerances)": string[];
  steps: string[];
  servings: number;
  preparationTime: number;
  cookTime: number;
  nutrition: Nutrition;
  type: string;
  createdAt: string;
  isPublished: string;
}
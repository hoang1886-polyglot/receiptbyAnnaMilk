export interface Recipe {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  cookTime: number;
  servings: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  ingredients: Ingredient[];
  steps: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

export interface MealPlan {
  id: number;
  date: string;
  mealType: string;
  recipeId: number;
  recipe?: Recipe;
}

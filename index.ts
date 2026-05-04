// src/types/index.ts
export type Category =
  | 'desserts'
  | 'asian'
  | 'european'
  | 'drinks'
  | 'diet'

export const CATEGORIES: { id: Category; label: string; emoji: string; description: string }[] = [
  { id: 'desserts', label: 'Десерты', emoji: '🍰', description: 'Сладкие угощения и выпечка' },
  { id: 'asian', label: 'Азиатские', emoji: '🍜', description: 'Блюда Азии и Востока' },
  { id: 'european', label: 'Европейские', emoji: '🥐', description: 'Классика европейской кухни' },
  { id: 'drinks', label: 'Напитки', emoji: '☕', description: 'Горячие и холодные напитки' },
  { id: 'diet', label: 'Для похудения', emoji: '🥗', description: 'Лёгкие и полезные блюда' },
]

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Завтрак', emoji: '🌅' },
  { id: 'lunch', label: 'Обед', emoji: '☀️' },
  { id: 'dinner', label: 'Ужин', emoji: '🌙' },
  { id: 'snack', label: 'Перекус', emoji: '🍎' },
]

export interface RecipeWithRelations {
  id: number
  title: string
  category: string
  imageUrl: string | null
  description: string | null
  calories: number
  protein: number
  fat: number
  carbs: number
  cookTime: number
  servings: number
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  steps: Step[]
}

export interface Ingredient {
  id: number
  name: string
  grams: number
  unit: string
  calories: number
  protein: number
  fat: number
  carbs: number
  recipeId: number
}

export interface Step {
  id: number
  order: number
  description: string
  duration: number | null
  recipeId: number
}

export interface MealPlanItem {
  id: number
  mealType: string
  servings: number
  recipeId: number
  mealPlanId: number
  recipe: RecipeWithRelations
}

export interface MealPlan {
  id: number
  date: Date
  name: string | null
  items: MealPlanItem[]
}

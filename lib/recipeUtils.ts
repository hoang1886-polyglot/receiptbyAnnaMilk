export type Ingredient = {
  name: string;
  grams: number;
};

export type Recipe = {
  ingredients: Ingredient[];
};

export function scaleRecipeByIngredient(
  recipe: Recipe,
  ingredientName: string,
  availableGrams: number
) {
  const baseIngredient = recipe.ingredients.find(
    (i) => i.name === ingredientName
  );

  if (!baseIngredient) {
    throw new Error("Ингредиент не найден");
  }

  const ratio = availableGrams / baseIngredient.grams;

  return recipe.ingredients.map((ing) => ({
    name: ing.name,
    grams: Math.round(ing.grams * ratio),
  }));
}

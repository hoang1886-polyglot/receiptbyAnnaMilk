// src/app/recipes/[id]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CATEGORIES, MEAL_TYPES } from '@/types'
import IngredientList from '@/components/recipe/IngredientList'
import AddToMealPlanModal from '@/components/meal-plan/AddToMealPlanModal'

async function getRecipe(id: string) {
  return prisma.recipe.findUnique({
    where: { id: parseInt(id) },
    include: {
      ingredients: true,
      steps: { orderBy: { order: 'asc' } },
    },
  })
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) notFound()

  const category = CATEGORIES.find(c => c.id === recipe.category)

  return (
    <div className="animate-page max-w-4xl mx-auto px-6 py-10">
      <Link href="/recipes" className="text-earth-700/60 hover:text-earth-800 text-sm mb-6 inline-flex items-center gap-1">
        ← Назад к рецептам
      </Link>

      {/* Hero image */}
      {recipe.imageUrl && (
        <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-cream-400/90 text-earth-900 text-xs font-semibold px-3 py-1 rounded-full">
              {category?.emoji} {category?.label}
            </span>
          </div>
        </div>
      )}

      {/* Title & meta */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
          <h1 className="font-display text-4xl font-bold text-earth-800 mb-3">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-earth-700/70 text-lg leading-relaxed">{recipe.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-earth-700/60">
            <span>⏱ {recipe.cookTime} мин</span>
            <span>👤 {recipe.servings} порции</span>
            <span>📋 {recipe.steps.length} шагов</span>
          </div>
        </div>
        <AddToMealPlanModal recipeId={recipe.id} mealTypes={MEAL_TYPES} />
      </div>

      {/* КБЖУ */}
      <div className="bg-gradient-to-r from-earth-800 to-earth-700 text-cream-50 rounded-2xl p-6 mb-8 grid grid-cols-4 gap-4">
        {[
          { label: 'Калории', value: Math.round(recipe.calories), unit: 'ккал', color: 'text-cream-400' },
          { label: 'Белки', value: Math.round(recipe.protein), unit: 'г', color: 'text-sage-400' },
          { label: 'Жиры', value: Math.round(recipe.fat), unit: 'г', color: 'text-cream-300' },
          { label: 'Углеводы', value: Math.round(recipe.carbs), unit: 'г', color: 'text-spice-400' },
        ].map(item => (
          <div key={item.label} className="text-center">
            <div className={`font-display text-3xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs opacity-60 mt-0.5">{item.unit}</div>
            <div className="text-xs opacity-50 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h2 className="font-display text-2xl font-bold text-earth-800 mb-4">
            Ингредиенты
            <span className="text-sm font-normal text-earth-700/50 ml-2">({recipe.ingredients.length})</span>
          </h2>
          <IngredientList ingredients={recipe.ingredients} />
        </div>

        {/* Steps */}
        <div>
          <h2 className="font-display text-2xl font-bold text-earth-800 mb-4">Приготовление</h2>
          <ol className="space-y-4">
            {recipe.steps.map(step => (
              <li key={step.id} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-spice-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.order}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-earth-800 leading-relaxed text-sm">{step.description}</p>
                  {step.duration && (
                    <span className="text-xs text-spice-500 font-medium mt-1 inline-block">
                      ⏱ {step.duration} мин
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

import { scaleRecipeByIngredient } from "@/lib/recipeUtils";
'use client'
import { useState } from 'react'
import type { Ingredient } from '@/types'

interface Props {
  ingredients: Ingredient[]
}

export default function IngredientList({ ingredients }: Props) {
  const [scaledIngredients, setScaledIngredients] = useState(ingredients)
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null)
  const [inputGrams, setInputGrams] = useState<number>(0)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const handleAutoScale = (name: string, grams: number) => {
    if (!grams) return

    const recipe = {
      ingredients: ingredients.map(i => ({
        name: i.name,
        grams: i.grams
      }))
    }
  
    const updated = scaleRecipeByIngredient(recipe, name, grams)
  
    setScaledIngredients(
      updated.map((u, index) => ({
        ...ingredients[index],
        grams: u.grams
      }))
    )
  }
  const handleScale = () => {
    const recipe = {
      ingredients: ingredients.map(i => ({
        name: i.name,
        grams: i.grams
      }))
    }

    const updated = scaleRecipeByIngredient(recipe, "Мука", 100)

    setScaledIngredients(
      updated.map((u, index) => ({
        ...ingredients[index],
        grams: u.grams
      }))
    )
  }

  const toggle = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allChecked = checked.size === ingredients.length

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-earth-700/50 mb-1.5">
          <span>Есть в наличии</span>
          <span>{checked.size}/{ingredients.length}</span>
        </div>
        <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-500 rounded-full transition-all duration-300"
            style={{ width: `${(checked.size / ingredients.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {scaledIngredients.map(ing => {
          const isChecked = checked.has(ing.id)
          return (
            <li
              key={ing.id}
              onClick={() => {
                  toggle(ing.id)
                  setSelectedIngredient(ing.name)
              }}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                isChecked
                  ? 'bg-sage-50 border-sage-200 opacity-60'
                  : 'bg-white border-cream-200 hover:border-cream-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isChecked ? 'bg-sage-500 border-sage-500' : 'border-cream-300'
                }`}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium transition-all ${isChecked ? 'line-through text-earth-700/40' : 'text-earth-800'}`}>
                  {ing.name}
                </span>
              </div>
              <span className="text-xs text-earth-700/50 font-mono">
                {ing.grams}{ing.unit}
              </span>
            </li>
          )
        })}
      </ul>

      {selectedIngredient && (
         <div className="mt-4 p-3 border rounded-xl bg-white">
            <p className="text-sm mb-2">
      Введите, сколько у вас есть: <b>{selectedIngredient}</b>
            </p>

            <input
              type="number"
              placeholder="граммы"
              className="w-full border p-2 rounded mb-2"
              onChange={(e) => {
                const grams = Number(e.target.value)
                setInputGrams(grams)
                handleAutoScale(selectedIngredient, grams)
              }}
           />
        </div>
      )}

      {allChecked && (
        <div className="mt-4 bg-sage-50 border border-sage-200 rounded-xl p-3 text-center text-sm text-sage-600 font-medium">
          ✅ Все ингредиенты готовы! Можно готовить!
        </div>
      )}

      <button
       onClick={handleScale}
       className="mt-4 w-full bg-sage-500 text-white py-2 rounded-xl"
      >
       Подогнать рецепт (тест)
    </button>
    </div>
  )
}

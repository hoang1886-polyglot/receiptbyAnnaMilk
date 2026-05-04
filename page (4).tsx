// src/app/meal-plan/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MEAL_TYPES } from '@/types'
import type { MealPlan } from '@/types'

function getWeekDates(offset = 0) {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function MealPlanPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)

  const weekDates = getWeekDates(weekOffset)
  const startDate = weekDates[0].toISOString().split('T')[0]
  const endDate = weekDates[6].toISOString().split('T')[0]

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/meal-plan?startDate=${startDate}&endDate=${endDate}`)
    const data = await res.json()
    setPlans(data)
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const getPlanForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return plans.find(p => p.date.toString().split('T')[0] === dateStr)
  }

  const removeItem = async (itemId: number) => {
    await fetch(`/api/meal-plan?itemId=${itemId}`, { method: 'DELETE' })
    fetchPlans()
  }

  // Weekly totals
  const weeklyCalories = plans.reduce((sum, plan) =>
    sum + plan.items.reduce((s, item) => s + item.recipe.calories * item.servings, 0), 0)

  const weeklyNutrition = plans.reduce((acc, plan) => {
    plan.items.forEach(item => {
      acc.protein += item.recipe.protein * item.servings
      acc.fat += item.recipe.fat * item.servings
      acc.carbs += item.recipe.carbs * item.servings
    })
    return acc
  }, { protein: 0, fat: 0, carbs: 0 })

  const totalItems = plans.reduce((sum, p) => sum + p.items.length, 0)

  return (
    <div className="animate-page max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-earth-800 mb-1">План питания</h1>
          <p className="text-earth-700/60">Неделя {weekOffset === 0 ? '(текущая)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="w-10 h-10 rounded-xl border border-cream-200 bg-white text-earth-700 hover:bg-cream-50 transition-colors flex items-center justify-center"
          >←</button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-earth-700 text-sm font-medium hover:bg-cream-50 transition-colors"
          >Сегодня</button>
          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="w-10 h-10 rounded-xl border border-cream-200 bg-white text-earth-700 hover:bg-cream-50 transition-colors flex items-center justify-center"
          >→</button>
        </div>
      </div>

      {/* Weekly summary */}
      {totalItems > 0 && (
        <div className="bg-gradient-to-r from-earth-800 to-earth-700 text-cream-50 rounded-2xl p-5 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-cream-400">{Math.round(weeklyCalories)}</div>
            <div className="text-xs opacity-60 mt-0.5">ккал за неделю</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-sage-400">{Math.round(weeklyNutrition.protein)}г</div>
            <div className="text-xs opacity-60 mt-0.5">белки</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-cream-300">{Math.round(weeklyNutrition.fat)}г</div>
            <div className="text-xs opacity-60 mt-0.5">жиры</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-spice-400">{Math.round(weeklyNutrition.carbs)}г</div>
            <div className="text-xs opacity-60 mt-0.5">углеводы</div>
          </div>
        </div>
      )}

      {/* Week grid */}
      {loading ? (
        <div className="grid grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-cream-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDates.map((date, dayIdx) => {
            const plan = getPlanForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()
            const dayCalories = plan?.items.reduce((s, i) => s + i.recipe.calories * i.servings, 0) || 0

            return (
              <div
                key={dayIdx}
                className={`rounded-2xl border p-3 min-h-36 ${
                  isToday ? 'border-spice-400 bg-spice-50' : 'border-cream-200 bg-white'
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-xs font-semibold ${isToday ? 'text-spice-500' : 'text-earth-700/50'}`}>
                      {DAY_NAMES[dayIdx]}
                    </div>
                    <div className={`font-bold text-lg leading-tight ${isToday ? 'text-spice-600' : 'text-earth-800'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  {dayCalories > 0 && (
                    <div className="text-xs font-medium text-earth-700/50 bg-cream-100 rounded-full px-2 py-0.5">
                      {Math.round(dayCalories)} кк
                    </div>
                  )}
                </div>

                {/* Meal groups */}
                {MEAL_TYPES.map(type => {
                  const meals = plan?.items.filter(i => i.mealType === type.id) || []
                  if (meals.length === 0) return null
                  return (
                    <div key={type.id} className="mb-2">
                      <div className="text-xs text-earth-700/40 font-medium mb-1">{type.emoji} {type.label}</div>
                      {meals.map(item => (
                        <div key={item.id} className="group flex items-start justify-between bg-cream-50 rounded-lg p-1.5 mb-1">
                          <Link href={`/recipes/${item.recipe.id}`} className="text-xs text-earth-800 hover:text-spice-600 font-medium leading-tight flex-1 line-clamp-2">
                            {item.recipe.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-earth-700/30 hover:text-spice-500 ml-1 flex-shrink-0 text-base leading-none"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )
                })}

                {!plan || plan.items.length === 0 ? (
                  <Link href="/recipes" className="text-xs text-earth-700/25 hover:text-spice-400 transition-colors">
                    + добавить
                  </Link>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/recipes"
          className="bg-spice-500 text-white font-medium px-6 py-3 rounded-xl hover:bg-spice-600 transition-colors inline-block"
        >
          Выбрать рецепты для плана →
        </Link>
      </div>
    </div>
  )
}

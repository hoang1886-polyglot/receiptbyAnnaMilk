// src/app/recipes/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/types'

interface IngredientRow {
  name: string; grams: number; unit: string
  calories: number; protein: number; fat: number; carbs: number
}

interface StepRow {
  description: string; duration: number | ''
}

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '', category: 'desserts', imageUrl: '', description: '',
    cookTime: 30, servings: 4,
  })

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: '', grams: 100, unit: 'г', calories: 0, protein: 0, fat: 0, carbs: 0 }
  ])

  const [steps, setSteps] = useState<StepRow[]>([
    { description: '', duration: '' }
  ])

  // Auto-calculate КБЖУ
  const totalNutrition = ingredients.reduce((acc, ing) => {
    const factor = ing.grams / 100
    return {
      calories: acc.calories + ing.calories * factor,
      protein: acc.protein + ing.protein * factor,
      fat: acc.fat + ing.fat * factor,
      carbs: acc.carbs + ing.carbs * factor,
    }
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 })

  const perServing = {
    calories: totalNutrition.calories / (form.servings || 1),
    protein: totalNutrition.protein / (form.servings || 1),
    fat: totalNutrition.fat / (form.servings || 1),
    carbs: totalNutrition.carbs / (form.servings || 1),
  }

  const updateIngredient = (i: number, key: keyof IngredientRow, value: string | number) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [key]: value } : ing))
  }

  const addIngredient = () => setIngredients(prev => [...prev, { name: '', grams: 100, unit: 'г', calories: 0, protein: 0, fat: 0, carbs: 0 }])
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i))

  const addStep = () => setSteps(prev => [...prev, { description: '', duration: '' }])
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return alert('Введите название рецепта')

    setLoading(true)
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          calories: perServing.calories,
          protein: perServing.protein,
          fat: perServing.fat,
          carbs: perServing.carbs,
          ingredients: ingredients.filter(i => i.name.trim()),
          steps: steps.filter(s => s.description.trim()).map(s => ({
            description: s.description,
            duration: s.duration || null,
          })),
        }),
      })

      if (res.ok) {
        const recipe = await res.json()
        router.push(`/recipes/${recipe.id}`)
      }
    } catch {
      alert('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-spice-400 bg-cream-50 focus:bg-white transition-colors"
  const labelClass = "text-sm font-medium text-earth-700 mb-1.5 block"

  return (
    <div className="animate-page max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-earth-800 mb-2">Новый рецепт</h1>
      <p className="text-earth-700/60 mb-8">Поделитесь своим любимым блюдом</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-100">
          <h2 className="font-display text-xl font-bold text-earth-800 mb-5">Основная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Название *</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Например: Тирамису классический" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Категория</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Фото (URL)</label>
              <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Время (мин)</label>
              <input type="number" value={form.cookTime} min={1}
                onChange={e => setForm({ ...form, cookTime: parseInt(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Порции</label>
              <input type="number" value={form.servings} min={1}
                onChange={e => setForm({ ...form, servings: parseInt(e.target.value) })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Описание</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Краткое описание блюда..." className={`${inputClass} resize-none`} />
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-earth-800">Ингредиенты</h2>
            <button type="button" onClick={addIngredient}
              className="text-spice-500 text-sm font-medium hover:text-spice-600">
              + Добавить
            </button>
          </div>

          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-xs text-earth-700/50 px-1">
              <span className="col-span-4">Название</span>
              <span className="col-span-2">Кол-во</span>
              <span className="col-span-1">Ед.</span>
              <span className="col-span-1">Ккал</span>
              <span className="col-span-1">Б</span>
              <span className="col-span-1">Ж</span>
              <span className="col-span-1">У</span>
              <span className="col-span-1" />
            </div>
            {ingredients.map((ing, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input type="text" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                  placeholder="Мука" className={`${inputClass} col-span-4`} />
                <input type="number" value={ing.grams} min={0} onChange={e => updateIngredient(i, 'grams', parseFloat(e.target.value))}
                  className={`${inputClass} col-span-2`} />
                <input type="text" value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  className={`${inputClass} col-span-1`} />
                {(['calories', 'protein', 'fat', 'carbs'] as const).map(key => (
                  <input key={key} type="number" value={ing[key]} min={0} step={0.1}
                    onChange={e => updateIngredient(i, key, parseFloat(e.target.value))}
                    className={`${inputClass} col-span-1 text-xs px-2`} />
                ))}
                <button type="button" onClick={() => removeIngredient(i)}
                  className="col-span-1 text-earth-700/30 hover:text-spice-500 text-lg leading-none">×</button>
              </div>
            ))}
          </div>

          {/* Auto КБЖУ */}
          <div className="mt-5 bg-earth-800 text-cream-50 rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-bold text-cream-400">{Math.round(perServing.calories)}</div>
              <div className="text-xs opacity-50">ккал/порц</div>
            </div>
            <div>
              <div className="font-bold text-sage-400">{Math.round(perServing.protein)}г</div>
              <div className="text-xs opacity-50">белки</div>
            </div>
            <div>
              <div className="font-bold text-cream-300">{Math.round(perServing.fat)}г</div>
              <div className="text-xs opacity-50">жиры</div>
            </div>
            <div>
              <div className="font-bold text-spice-400">{Math.round(perServing.carbs)}г</div>
              <div className="text-xs opacity-50">углеводы</div>
            </div>
          </div>
          <p className="text-xs text-earth-700/40 mt-2 text-center">КБЖУ рассчитывается автоматически на {form.servings} порц.</p>
        </section>

        {/* Steps */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-earth-800">Шаги приготовления</h2>
            <button type="button" onClick={addStep}
              className="text-spice-500 text-sm font-medium hover:text-spice-600">
              + Шаг
            </button>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-spice-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={e => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, description: e.target.value } : s))}
                    placeholder="Описание шага..."
                    className={`${inputClass} resize-none mb-2`}
                  />
                  <input
                    type="number"
                    value={step.duration}
                    min={0}
                    onChange={e => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, duration: e.target.value ? parseInt(e.target.value) : '' } : s))}
                    placeholder="Время (мин, необязательно)"
                    className={`${inputClass} text-xs`}
                  />
                </div>
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)}
                    className="text-earth-700/30 hover:text-spice-500 text-xl mt-1">×</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl border border-cream-200 text-earth-700 font-medium hover:bg-cream-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-spice-500 text-white font-semibold hover:bg-spice-600 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : '✓ Сохранить рецепт'}
          </button>
        </div>
      </form>
    </div>
  )
}

// src/components/meal-plan/AddToMealPlanModal.tsx
'use client'
import { useState } from 'react'

interface Props {
  recipeId: number
  mealTypes: { id: string; label: string; emoji: string }[]
}

export default function AddToMealPlanModal({ recipeId, mealTypes }: Props) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [mealType, setMealType] = useState('lunch')
  const [servings, setServings] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, date, mealType, servings }),
      })
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 1500)
    } catch {
      alert('Ошибка при добавлении в план')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-earth-800 text-cream-50 font-medium px-5 py-3 rounded-xl hover:bg-earth-700 transition-colors text-sm whitespace-nowrap shadow-sm"
      >
        📅 В план питания
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-display text-xl text-earth-800">Добавлено в план!</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold text-earth-800 mb-5">
                  Добавить в план питания
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-earth-700 mb-1.5 block">Дата</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-spice-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth-700 mb-1.5 block">Приём пищи</label>
                    <div className="grid grid-cols-2 gap-2">
                      {mealTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setMealType(type.id)}
                          className={`py-2 rounded-xl text-sm font-medium transition-all ${
                            mealType === type.id
                              ? 'bg-earth-800 text-cream-50'
                              : 'bg-cream-50 text-earth-700 border border-cream-200 hover:border-earth-400'
                          }`}
                        >
                          {type.emoji} {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth-700 mb-1.5 block">Порции</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                        className="w-9 h-9 rounded-full bg-cream-100 text-earth-800 font-bold hover:bg-cream-200 transition-colors"
                      >−</button>
                      <span className="font-bold text-earth-800 text-lg w-8 text-center">{servings}</span>
                      <button
                        onClick={() => setServings(servings + 0.5)}
                        className="w-9 h-9 rounded-full bg-cream-100 text-earth-800 font-bold hover:bg-cream-200 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-cream-200 text-earth-700 text-sm font-medium hover:bg-cream-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-spice-500 text-white text-sm font-medium hover:bg-spice-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? '...' : 'Добавить'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

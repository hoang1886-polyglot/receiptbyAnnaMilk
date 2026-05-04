// src/app/recipes/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import RecipeCard from '@/components/recipe/RecipeCard'
import { CATEGORIES } from '@/types'
import type { RecipeWithRelations, Category } from '@/types'
import Link from 'next/link'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    if (ingredientSearch) params.set('ingredient', ingredientSearch)

    const res = await fetch(`/api/recipes?${params}`)
    const data = await res.json()
    setRecipes(data)
    setLoading(false)
  }, [category, search, ingredientSearch])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="animate-page max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-earth-800 mb-1">Рецепты</h1>
          <p className="text-earth-700/60">{recipes.length} блюд найдено</p>
        </div>
        <Link
          href="/recipes/new"
          className="bg-spice-500 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-spice-600 transition-colors shadow-sm"
        >
          + Добавить рецепт
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Поиск по названию..."
              className="flex-1 border border-cream-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-spice-400 bg-cream-50"
            />
            <button
              type="submit"
              className="bg-earth-800 text-cream-50 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-earth-700 transition-colors"
            >
              Найти
            </button>
          </form>
          <div className="flex gap-2">
            <input
              type="text"
              value={ingredientSearch}
              onChange={e => setIngredientSearch(e.target.value)}
              placeholder="Найти по ингредиенту..."
              className="flex-1 border border-cream-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sage-500 bg-cream-50"
            />
            {ingredientSearch && (
              <button
                onClick={() => setIngredientSearch('')}
                className="text-earth-700/50 hover:text-earth-800 px-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            category === 'all'
              ? 'bg-earth-800 text-cream-50 shadow-sm'
              : 'bg-white text-earth-700 border border-cream-200 hover:border-earth-400'
          }`}
        >
          🍽️ Все
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.id
                ? 'bg-earth-800 text-cream-50 shadow-sm'
                : 'bg-white text-earth-700 border border-cream-200 hover:border-earth-400'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-cream-100" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-2xl text-earth-700 mb-2">Ничего не найдено</h3>
          <p className="text-earth-700/50 mb-6">Попробуйте изменить параметры поиска</p>
          <Link href="/recipes/new" className="text-spice-500 font-medium hover:text-spice-600">
            Добавить первый рецепт →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

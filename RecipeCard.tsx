// src/components/recipe/RecipeCard.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/types'
import type { RecipeWithRelations } from '@/types'

interface Props {
  recipe: RecipeWithRelations
}

export default function RecipeCard({ recipe }: Props) {
  const category = CATEGORIES.find(c => c.id === recipe.category)

  return (
    <Link href={`/recipes/${recipe.id}`} className="recipe-card block bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-100 group">
      {/* Image */}
      <div className="relative h-48 bg-cream-100 overflow-hidden">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            {category?.emoji || '🍽️'}
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-earth-800/80 text-cream-100 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {category?.emoji} {category?.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-earth-800 mb-2 leading-tight line-clamp-2">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-earth-700/60 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-earth-700/50 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.cookTime} мин
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {recipe.servings} порц.
          </span>
          <span>{recipe.ingredients.length} ингр.</span>
        </div>

        {/* КБЖУ */}
        <div className="grid grid-cols-4 gap-1 bg-cream-50 rounded-xl p-2">
          {[
            { label: 'Ккал', value: Math.round(recipe.calories), color: 'text-spice-500' },
            { label: 'Б', value: Math.round(recipe.protein) + 'г', color: 'text-sage-600' },
            { label: 'Ж', value: Math.round(recipe.fat) + 'г', color: 'text-cream-500' },
            { label: 'У', value: Math.round(recipe.carbs) + 'г', color: 'text-earth-600' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className={`font-bold text-sm ${item.color}`}>{item.value}</div>
              <div className="text-xs text-earth-700/40">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}

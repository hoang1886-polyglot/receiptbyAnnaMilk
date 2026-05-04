// src/app/page.tsx
import Link from 'next/link'
import { CATEGORIES } from '@/types'
import { prisma } from '@/lib/prisma'
import RecipeCard from '@/components/recipe/RecipeCard'

async function getRecentRecipes() {
  return prisma.recipe.findMany({
    include: { ingredients: true, steps: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

export default async function HomePage() {
  const recentRecipes = await getRecentRecipes()

  return (
    <div className="animate-page">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-earth-800 via-earth-700 to-spice-600 text-white py-28 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-cream-300 text-sm font-medium tracking-widest uppercase mb-4">Добро пожаловать</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Готовьте<br />
            <span className="text-cream-400">с любовью</span>
          </h1>
          <p className="text-cream-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Откройте мир вкусов: от классических европейских блюд до секретов азиатской кухни.
            Планируйте питание и следите за КБЖУ.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/recipes"
              className="bg-cream-400 text-earth-900 font-semibold px-8 py-3 rounded-full hover:bg-cream-300 transition-colors shadow-lg"
            >
              Смотреть рецепты
            </Link>
            <Link
              href="/meal-plan"
              className="border-2 border-cream-400/50 text-cream-100 font-semibold px-8 py-3 rounded-full hover:bg-cream-400/10 transition-colors"
            >
              План питания
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-earth-800 mb-2">Категории</h2>
        <p className="text-earth-700/60 mb-8">Выберите, что хотите приготовить сегодня</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              href={`/recipes?category=${cat.id}`}
              className="group bg-white rounded-2xl p-5 text-center shadow-sm border border-cream-200 hover:border-spice-400 hover:shadow-md transition-all duration-200"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-semibold text-earth-800 text-sm mb-1">{cat.label}</div>
              <div className="text-xs text-earth-700/50 leading-tight">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Recipes */}
      {recentRecipes.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-earth-800 mb-1">Недавние рецепты</h2>
              <p className="text-earth-700/60">Свежие добавления в нашу коллекцию</p>
            </div>
            <Link href="/recipes" className="text-spice-500 font-medium hover:text-spice-600 text-sm">
              Все рецепты →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="bg-earth-800 text-cream-50 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-display text-4xl font-bold text-cream-400 mb-1">{recentRecipes.length}+</div>
            <div className="text-cream-200/70 text-sm">Рецептов</div>
          </div>
          <div>
            <div className="font-display text-4xl font-bold text-cream-400 mb-1">5</div>
            <div className="text-cream-200/70 text-sm">Категорий</div>
          </div>
          <div>
            <div className="font-display text-4xl font-bold text-cream-400 mb-1">КБЖУ</div>
            <div className="text-cream-200/70 text-sm">Авторасчёт</div>
          </div>
        </div>
      </section>
    </div>
  )
}

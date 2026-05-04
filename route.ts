// src/app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const ingredient = searchParams.get('ingredient')

    const where: Record<string, unknown> = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    if (ingredient) {
      where.ingredients = {
        some: {
          name: { contains: ingredient, mode: 'insensitive' }
        }
      }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
        steps: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('GET /api/recipes error:', error)
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title, category, imageUrl, description,
      calories, protein, fat, carbs, cookTime, servings,
      ingredients, steps,
    } = body

    // Auto-calculate КБЖУ from ingredients if not provided
    let finalCalories = calories
    let finalProtein = protein
    let finalFat = fat
    let finalCarbs = carbs

    if (ingredients?.length && (!calories || calories === 0)) {
      finalCalories = ingredients.reduce((sum: number, i: { calories: number; grams: number }) => sum + (i.calories * i.grams / 100), 0)
      finalProtein = ingredients.reduce((sum: number, i: { protein: number; grams: number }) => sum + (i.protein * i.grams / 100), 0)
      finalFat = ingredients.reduce((sum: number, i: { fat: number; grams: number }) => sum + (i.fat * i.grams / 100), 0)
      finalCarbs = ingredients.reduce((sum: number, i: { carbs: number; grams: number }) => sum + (i.carbs * i.grams / 100), 0)
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        category,
        imageUrl,
        description,
        calories: finalCalories / (servings || 1),
        protein: finalProtein / (servings || 1),
        fat: finalFat / (servings || 1),
        carbs: finalCarbs / (servings || 1),
        cookTime: cookTime || 30,
        servings: servings || 4,
        ingredients: {
          create: ingredients?.map((ing: {
            name: string; grams: number; unit?: string;
            calories?: number; protein?: number; fat?: number; carbs?: number
          }) => ({
            name: ing.name,
            grams: ing.grams,
            unit: ing.unit || 'г',
            calories: ing.calories || 0,
            protein: ing.protein || 0,
            fat: ing.fat || 0,
            carbs: ing.carbs || 0,
          })) || [],
        },
        steps: {
          create: steps?.map((step: { description: string; duration?: number }, idx: number) => ({
            order: idx + 1,
            description: step.description,
            duration: step.duration || null,
          })) || [],
        },
      },
      include: {
        ingredients: true,
        steps: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('POST /api/recipes error:', error)
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 })
  }
}

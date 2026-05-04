// src/app/api/meal-plan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Record<string, unknown> = {}

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const plans = await prisma.mealPlan.findMany({
      where,
      include: {
        items: {
          include: {
            recipe: {
              include: { ingredients: true, steps: true }
            }
          }
        }
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('GET /api/meal-plan error:', error)
    return NextResponse.json({ error: 'Failed to fetch meal plans' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, name, recipeId, mealType, servings } = body

    // Find or create a plan for that date
    const dateObj = new Date(date)
    dateObj.setHours(0, 0, 0, 0)

    let plan = await prisma.mealPlan.findFirst({
      where: {
        date: {
          gte: dateObj,
          lt: new Date(dateObj.getTime() + 86400000),
        }
      }
    })

    if (!plan) {
      plan = await prisma.mealPlan.create({
        data: {
          date: dateObj,
          name: name || null,
        }
      })
    }

    const item = await prisma.mealPlanItem.create({
      data: {
        mealPlanId: plan.id,
        recipeId: parseInt(recipeId),
        mealType: mealType || 'lunch',
        servings: servings || 1,
      },
      include: {
        recipe: { include: { ingredients: true, steps: true } }
      }
    })

    return NextResponse.json({ plan, item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/meal-plan error:', error)
    return NextResponse.json({ error: 'Failed to add to meal plan' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'itemId required' }, { status: 400 })
    }

    await prisma.mealPlanItem.delete({
      where: { id: parseInt(itemId) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/meal-plan error:', error)
    return NextResponse.json({ error: 'Failed to delete meal plan item' }, { status: 500 })
  }
}

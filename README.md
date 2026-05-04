# КулинАрт — Recipe App

Полноценное веб-приложение для рецептов с планировщиком питания.

## Технологии

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Стили**: Tailwind CSS
- **Backend**: Next.js API Routes
- **БД**: Prisma + SQLite

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл .env (уже создан: DATABASE_URL="file:./dev.db")

# 3. Создать базу данных
npm run db:push

# 4. Заполнить тестовыми данными (6 рецептов)
npm run db:seed

# 5. Запустить dev-сервер
npm run dev
```

Открыть: http://localhost:3000

## Структура проекта

```
recipe-app/
├── prisma/
│   ├── schema.prisma        # Схема БД (Recipe, Ingredient, Step, MealPlan)
│   └── seed.ts              # Тестовые данные
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Корневой layout
│   │   ├── page.tsx         # Главная страница
│   │   ├── globals.css      # Глобальные стили
│   │   ├── api/
│   │   │   ├── recipes/     # GET /api/recipes, POST /api/recipes
│   │   │   │   └── [id]/    # GET/DELETE /api/recipes/:id
│   │   │   └── meal-plan/   # GET/POST/DELETE /api/meal-plan
│   │   ├── recipes/
│   │   │   ├── page.tsx     # Список рецептов + фильтры
│   │   │   ├── [id]/page.tsx # Страница рецепта
│   │   │   └── new/page.tsx  # Форма добавления
│   │   └── meal-plan/
│   │       └── page.tsx     # Планировщик питания (неделя)
│   ├── components/
│   │   ├── ui/Navbar.tsx
│   │   ├── recipe/
│   │   │   ├── RecipeCard.tsx
│   │   │   └── IngredientList.tsx  # Отметка ингредиентов
│   │   └── meal-plan/
│   │       └── AddToMealPlanModal.tsx
│   ├── lib/prisma.ts        # Prisma client
│   └── types/index.ts       # TypeScript типы
```

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | /api/recipes | Список рецептов (фильтры: category, search, ingredient) |
| POST | /api/recipes | Создать рецепт (авторасчёт КБЖУ) |
| GET | /api/recipes/:id | Один рецепт |
| DELETE | /api/recipes/:id | Удалить рецепт |
| GET | /api/meal-plan | Планы питания (фильтр: startDate, endDate) |
| POST | /api/meal-plan | Добавить рецепт в план |
| DELETE | /api/meal-plan?itemId=X | Удалить из плана |

## Функции

- ✅ 5 категорий (Десерты, Азиатские, Европейские, Напитки, Диета)
- ✅ Добавление рецептов с КБЖУ
- ✅ Авторасчёт калорийности из ингредиентов
- ✅ Поиск по названию и ингредиентам
- ✅ Отметка "у меня есть этот ингредиент" ✓
- ✅ Недельный план питания
- ✅ Подсчёт общей калорийности по дням/неделе
- ✅ Адаптивный дизайн (mobile-first)

// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.mealPlanItem.deleteMany()
  await prisma.mealPlan.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.step.deleteMany()
  await prisma.recipe.deleteMany()

  // Recipe 1: Tiramisu (Desserts)
  await prisma.recipe.create({
    data: {
      title: 'Классический тирамису',
      category: 'desserts',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      description: 'Нежный итальянский десерт с маскарпоне и эспрессо',
      calories: 420,
      protein: 8,
      fat: 28,
      carbs: 35,
      cookTime: 30,
      servings: 6,
      ingredients: {
        create: [
          { name: 'Маскарпоне', grams: 500, unit: 'г', calories: 400, protein: 7, fat: 42, carbs: 3 },
          { name: 'Яйца', grams: 180, unit: 'г', calories: 144, protein: 13, fat: 10, carbs: 1 },
          { name: 'Сахар', grams: 100, unit: 'г', calories: 387, protein: 0, fat: 0, carbs: 100 },
          { name: 'Печенье савоярди', grams: 200, unit: 'г', calories: 380, protein: 9, fat: 7, carbs: 73 },
          { name: 'Эспрессо', grams: 200, unit: 'мл', calories: 5, protein: 0, fat: 0, carbs: 1 },
          { name: 'Какао-порошок', grams: 20, unit: 'г', calories: 20, protein: 2, fat: 1, carbs: 3 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Разделите яйца на желтки и белки. Взбейте желтки с сахаром до побеления.' },
          { order: 2, description: 'Добавьте маскарпоне к желткам и перемешайте до однородности.' },
          { order: 3, description: 'Взбейте белки в крепкую пену и аккуратно введите в крем.' },
          { order: 4, description: 'Приготовьте эспрессо и дайте остыть. Обмакивайте савоярди в кофе.' },
          { order: 5, description: 'Выложите слой печенья, затем слой крема. Повторите.' },
          { order: 6, description: 'Посыпьте какао и уберите в холодильник на 4-6 часов.', duration: 360 },
        ]
      }
    }
  })

  // Recipe 2: Ramen (Asian)
  await prisma.recipe.create({
    data: {
      title: 'Японский рамен с яйцом',
      category: 'asian',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      description: 'Насыщенный бульон с лапшой, яйцом и ростками',
      calories: 520,
      protein: 32,
      fat: 18,
      carbs: 55,
      cookTime: 90,
      servings: 2,
      ingredients: {
        create: [
          { name: 'Лапша рамен', grams: 200, unit: 'г', calories: 280, protein: 10, fat: 2, carbs: 58 },
          { name: 'Куриный бульон', grams: 800, unit: 'мл', calories: 40, protein: 4, fat: 2, carbs: 2 },
          { name: 'Свинина (грудинка)', grams: 200, unit: 'г', calories: 360, protein: 20, fat: 30, carbs: 0 },
          { name: 'Яйца', grams: 120, unit: 'г', calories: 96, protein: 8, fat: 7, carbs: 1 },
          { name: 'Соевый соус', grams: 40, unit: 'мл', calories: 24, protein: 3, fat: 0, carbs: 4 },
          { name: 'Нори (водоросли)', grams: 10, unit: 'г', calories: 5, protein: 1, fat: 0, carbs: 1 },
          { name: 'Зелёный лук', grams: 30, unit: 'г', calories: 10, protein: 0, fat: 0, carbs: 2 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Сварите яйца вкрутую (7 минут), остудите и очистите. Замаринуйте в соевом соусе.', duration: 7 },
          { order: 2, description: 'Обжарьте грудинку до золотистой корочки, нарежьте тонкими ломтиками.' },
          { order: 3, description: 'Доведите бульон до кипения, добавьте соевый соус, мисо-пасту.' },
          { order: 4, description: 'Отварите лапшу по инструкции (обычно 3-4 минуты).', duration: 4 },
          { order: 5, description: 'Разложите лапшу по тарелкам, залейте горячим бульоном.' },
          { order: 6, description: 'Сверху выложите мясо, яйцо, нори и посыпьте зелёным луком.' },
        ]
      }
    }
  })

  // Recipe 3: French Onion Soup (European)
  await prisma.recipe.create({
    data: {
      title: 'Французский луковый суп',
      category: 'european',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      description: 'Классический французский суп с карамелизованным луком и сыром',
      calories: 310,
      protein: 14,
      fat: 16,
      carbs: 28,
      cookTime: 60,
      servings: 4,
      ingredients: {
        create: [
          { name: 'Лук репчатый', grams: 800, unit: 'г', calories: 320, protein: 8, fat: 0, carbs: 74 },
          { name: 'Сливочное масло', grams: 50, unit: 'г', calories: 360, protein: 0, fat: 40, carbs: 0 },
          { name: 'Говяжий бульон', grams: 1000, unit: 'мл', calories: 80, protein: 8, fat: 4, carbs: 4 },
          { name: 'Сыр грюйер', grams: 150, unit: 'г', calories: 570, protein: 30, fat: 48, carbs: 0 },
          { name: 'Багет', grams: 100, unit: 'г', calories: 260, protein: 8, fat: 1, carbs: 53 },
          { name: 'Белое вино', grams: 100, unit: 'мл', calories: 80, protein: 0, fat: 0, carbs: 3 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Нарежьте лук тонкими полукольцами. Растопите масло в глубокой кастрюле.' },
          { order: 2, description: 'Карамелизуйте лук на медленном огне 40-45 минут, помешивая каждые 5 минут.', duration: 45 },
          { order: 3, description: 'Добавьте вино и готовьте до испарения. Влейте бульон, варите 15 минут.', duration: 15 },
          { order: 4, description: 'Поджарьте ломтики багета в духовке до хрустящей корочки.' },
          { order: 5, description: 'Разлейте суп по жаропрочным мискам, сверху хлеб и тёртый сыр.' },
          { order: 6, description: 'Поставьте под гриль на 3-4 минуты до расплавления сыра.', duration: 4 },
        ]
      }
    }
  })

  // Recipe 4: Matcha Latte (Drinks)
  await prisma.recipe.create({
    data: {
      title: 'Матча латте',
      category: 'drinks',
      imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
      description: 'Нежный горячий напиток из японского зелёного чая матча',
      calories: 120,
      protein: 4,
      fat: 4,
      carbs: 16,
      cookTime: 5,
      servings: 1,
      ingredients: {
        create: [
          { name: 'Порошок матча', grams: 5, unit: 'г', calories: 15, protein: 1, fat: 0, carbs: 2 },
          { name: 'Горячая вода (80°C)', grams: 60, unit: 'мл', calories: 0, protein: 0, fat: 0, carbs: 0 },
          { name: 'Молоко (растительное или коровье)', grams: 200, unit: 'мл', calories: 90, protein: 3, fat: 4, carbs: 10 },
          { name: 'Мёд или сироп агавы', grams: 15, unit: 'г', calories: 45, protein: 0, fat: 0, carbs: 12 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Просейте матча через мелкое сито в чашку, чтобы избежать комков.' },
          { order: 2, description: 'Добавьте 60 мл горячей воды (80°C, не кипяток!) и взбейте венчиком до пены.' },
          { order: 3, description: 'Подогрейте молоко и взбейте до образования пены блендером или капучинатором.' },
          { order: 4, description: 'Добавьте мёд в матчу, перемешайте. Влейте молоко, не перемешивая для красивых слоёв.' },
        ]
      }
    }
  })

  // Recipe 5: Diet Chicken Salad
  await prisma.recipe.create({
    data: {
      title: 'Куриный салат с авокадо',
      category: 'diet',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      description: 'Лёгкий белковый салат для похудения без майонеза',
      calories: 280,
      protein: 35,
      fat: 12,
      carbs: 8,
      cookTime: 20,
      servings: 2,
      ingredients: {
        create: [
          { name: 'Куриная грудка', grams: 300, unit: 'г', calories: 330, protein: 63, fat: 6, carbs: 0 },
          { name: 'Авокадо', grams: 150, unit: 'г', calories: 240, protein: 3, fat: 22, carbs: 3 },
          { name: 'Руккола', grams: 80, unit: 'г', calories: 20, protein: 2, fat: 0, carbs: 2 },
          { name: 'Черри томаты', grams: 100, unit: 'г', calories: 18, protein: 1, fat: 0, carbs: 4 },
          { name: 'Лимонный сок', grams: 30, unit: 'мл', calories: 7, protein: 0, fat: 0, carbs: 2 },
          { name: 'Оливковое масло', grams: 15, unit: 'мл', calories: 130, protein: 0, fat: 14, carbs: 0 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Отварите куриную грудку в подсоленной воде 20 минут, дайте остыть и разберите на волокна.', duration: 20 },
          { order: 2, description: 'Нарежьте авокадо кубиками, сбрызните лимонным соком.' },
          { order: 3, description: 'Разрежьте томаты пополам, промойте рукколу.' },
          { order: 4, description: 'Смешайте все ингредиенты, заправьте оливковым маслом и лимонным соком.' },
          { order: 5, description: 'Посолите, поперчите по вкусу. Подавайте сразу.' },
        ]
      }
    }
  })

  // Recipe 6: Croissants (European)
  await prisma.recipe.create({
    data: {
      title: 'Домашние круассаны',
      category: 'european',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
      description: 'Слоёные французские круассаны с хрустящей корочкой',
      calories: 380,
      protein: 7,
      fat: 20,
      carbs: 43,
      cookTime: 180,
      servings: 8,
      ingredients: {
        create: [
          { name: 'Мука пшеничная', grams: 500, unit: 'г', calories: 1700, protein: 50, fat: 4, carbs: 360 },
          { name: 'Сливочное масло', grams: 250, unit: 'г', calories: 1800, protein: 2, fat: 200, carbs: 2 },
          { name: 'Молоко', grams: 300, unit: 'мл', calories: 180, protein: 10, fat: 10, carbs: 14 },
          { name: 'Дрожжи сухие', grams: 7, unit: 'г', calories: 20, protein: 3, fat: 0, carbs: 3 },
          { name: 'Сахар', grams: 50, unit: 'г', calories: 193, protein: 0, fat: 0, carbs: 50 },
          { name: 'Соль', grams: 10, unit: 'г', calories: 0, protein: 0, fat: 0, carbs: 0 },
        ]
      },
      steps: {
        create: [
          { order: 1, description: 'Смешайте муку, сахар, соль, дрожжи. Добавьте тёплое молоко, замесите тесто.' },
          { order: 2, description: 'Оставьте тесто под плёнкой на 1 час в тёплом месте.', duration: 60 },
          { order: 3, description: 'Раскатайте холодное масло между пергаментом в прямоугольник.' },
          { order: 4, description: 'Оберните масло тестом и сделайте 3 книжных складки, охлаждая 30 мин между каждой.', duration: 90 },
          { order: 5, description: 'Раскатайте тесто, нарежьте треугольники и скрутите круассаны.' },
          { order: 6, description: 'Выпекайте при 200°C 18-20 минут до золотистого цвета.', duration: 20 },
        ]
      }
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

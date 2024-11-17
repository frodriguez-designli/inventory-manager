import { PrismaClient } from '@prisma/client'
import { 
    CATEGORY
 } from '../src/utils/enum/category'

const prisma = new PrismaClient();

async function category (){
    await prisma.categories.createMany({
        data: [
            {
                name: CATEGORY.FOOD
            },
            {
                name: CATEGORY.DRINK
            },
            {
                name: CATEGORY.OTHER
            },
           
        ]
    })
}

category()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
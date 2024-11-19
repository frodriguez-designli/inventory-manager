import { PrismaClient } from '@prisma/client'
import { 
    OrderType
 } from '../src/utils/enum/order'

const prisma = new PrismaClient();

async function orderType (){
    await prisma.orderType.createMany({
        data: [
            {
                name: OrderType.DELIVERY
            },
            {
                name: OrderType.TAKE_AWAY
            },
           
        ]
    })
} 
orderType()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
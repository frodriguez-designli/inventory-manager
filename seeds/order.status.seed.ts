import { PrismaClient } from '@prisma/client'
import { 
    OrderStatusEnum
 } from '../src/utils/enum/order'

const prisma = new PrismaClient();

async function orderStatus (){
    await prisma.orderStatus.createMany({
        data: [
            {
                name: OrderStatusEnum.CANCELED
            },
            {
                name: OrderStatusEnum.PAID
            },
            {
                name: OrderStatusEnum.DELIVERED
            },
            {
                name: OrderStatusEnum.PENDING
            },
           
        ]
    })
}

orderStatus()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
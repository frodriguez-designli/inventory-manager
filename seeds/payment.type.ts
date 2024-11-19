import { PrismaClient } from '@prisma/client'
import { 
    PaymentType
 } from '../src/utils/enum/payment'

const prisma = new PrismaClient();

async function paymentType (){
    await prisma.paymentType.createMany({
        data: [
            {
                name: PaymentType.CASH
            },
            {
                name: PaymentType.BANK_TRANSFER
            },
            {
                name: PaymentType.CREDIT_CARD
            },
            {
                name: PaymentType.CREDIT_CARD
            },
        ]
    })
} 

paymentType()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
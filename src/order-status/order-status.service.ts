import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderStatusService {
    constructor(private readonly prisma: PrismaService) {}
    findOneByName(orderStatusName: string) {
        return this.prisma.orderStatus.findFirst({
            where: {
                name: orderStatusName
            }
        });
      }
    
}

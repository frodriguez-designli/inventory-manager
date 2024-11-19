import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client'; 
import { OrderStatusEnum } from '../utils/enum/order';

@Injectable()
export class OrderStatusService implements OnModuleInit {
  private readonly logger = new Logger(OrderStatusService.name);
  private orderStatusesMap: Map<OrderStatusEnum, any> = new Map();  

  constructor(private readonly prisma: PrismaService) {}

  /**
   * This method will be called when the module is initialized
   * and will load all order statuses into memory.
   */
  async onModuleInit() {
    await this.loadOrderStatuses();  // Load order statuses into memory when the app starts
  }

  private async loadOrderStatuses() {
    try {
      const statuses = await this.prisma.orderStatus.findMany();
      this.orderStatusesMap.clear();
      statuses.forEach((orderStatus) => {
        const key = orderStatus.name as OrderStatusEnum;
        if (Object.values(OrderStatusEnum).includes(key)) {
          this.orderStatusesMap.set(key, orderStatus);
        }
      });

      this.logger.log('Order statuses loaded into memory');
    } catch (error) {
      this.logger.error('Failed to load order statuses into memory', error);
    }
  }
  async findOneByEnum(orderStatusEnum: OrderStatusEnum): Promise<OrderStatus | null> {
    const status = this.orderStatusesMap[orderStatusEnum];
    
    if (status) {
      return status;  // Return status from memory if available
    }

    // If not found in memory, fallback to querying the database
    return this.prisma.orderStatus.findFirst({
      where: { name: orderStatusEnum },  // Adjust the query if necessary
    });
  }
}

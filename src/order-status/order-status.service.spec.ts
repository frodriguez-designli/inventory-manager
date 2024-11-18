import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusService } from './order-status.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('OrderStatusService', () => {
  let service: OrderStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderStatusService, PrismaService],
    }).compile();

    service = module.get<OrderStatusService>(OrderStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

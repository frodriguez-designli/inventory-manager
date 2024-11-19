import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ProductService } from '../product/product.service';
import { RabbitMQService } from '../rabbit-mq/rabbit-mq.service';
import { OrderStatusService } from '../order-status/order-status.service';


jest.mock('../prisma/prisma.service');
jest.mock('../redis/redis.service');
jest.mock('../product/product.service');
jest.mock('../rabbit-mq/rabbit-mq.service');

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: jest.Mocked<PrismaService>;
  let redisService: jest.Mocked<RedisService>;
  let productService: jest.Mocked<ProductService>;
  let orderStatusService: jest.Mocked<OrderStatusService>;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  const mockPrismaService = {
    orders: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockOrderStatusService = {
    findOne: jest.fn(),
    findOneByEnum: jest.fn(),
  };

  const mockRabbitMQService = {
    getConnection: jest.fn(),
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: OrderStatusService,
          useValue: mockOrderStatusService,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
    
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get(PrismaService);
    redisService = module.get(RedisService);
    productService = module.get(ProductService);
    orderStatusService = module.get(OrderStatusService);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
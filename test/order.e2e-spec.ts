import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/order/order.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProductService } from '../src/product/product.service';
import { RabbitMQService } from '../src/rabbit-mq/rabbit-mq.service';
import { RedisService } from '../src/redis/redis.service';
import { BadRequestException } from '@nestjs/common';
import { OrderConsumer } from '../src/order/order-consumer.service';


describe('OrderService Integration', () => {
  let module: TestingModule;
  let orderService: OrderService;
  let orderConsumer: OrderConsumer;
  let prismaService: PrismaService;
  let productService: ProductService;
  let rabbitMQService: RabbitMQService;
  let redisService: RedisService;
  let testCustomer;
  let testProduct;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
     
      ],
      providers: [
        OrderService,
        OrderConsumer,
        PrismaService,
        ProductService,
        RabbitMQService,
        RedisService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderConsumer = module.get<OrderConsumer>(OrderConsumer);
    prismaService = module.get<PrismaService>(PrismaService);
    productService = module.get<ProductService>(ProductService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    redisService = module.get<RedisService>(RedisService);

    await module.createNestApplication().init();
  });

  beforeEach(async () => {
    // Clean up database
    await prismaService.orderProducts.deleteMany();
    await prismaService.orders.deleteMany();
    await prismaService.products.deleteMany();
    await prismaService.customers.deleteMany();
    await prismaService.orderStatus.deleteMany();
    await prismaService.orderType.deleteMany();
    await prismaService.paymentType.deleteMany();

    // Create base data
    const [orderStatus, orderType, paymentType] = await Promise.all([
      prismaService.orderStatus.create({
        data: { order_status_id: 1, name: 'Pending' }
      }),
      prismaService.orderType.create({
        data: { order_type: 1, name: 'Regular' }
      }),
      prismaService.paymentType.create({
        data: { payment_type: 1, name: 'Credit Card' }
      })
    ]);

    testCustomer = await prismaService.customers.create({
      data: {
        customer_name: 'Test Customer',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      }
    });

    testProduct = await prismaService.products.create({
      data: {
        product_name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category_id: 1,
        inventory_id: 1
      }
    });

    // Clear Redis cache
    await redisService.del('orders:*');
  });

  describe('Order Creation Flow', () => {
    it('should create an order successfully', async () => {
      const orderDto = {
        customer_id: testCustomer.customer_id,
        order_type: 1,
        payment_type: 1,
        order_date: new Date(),
        order_status_id: 1,
        products: [
          {
            product_id: testProduct.product_id,
            quantity: 2
          }
        ],
        
      };

      const result = await orderService.create(orderDto);
      expect(result).toHaveProperty('orderId');

      // Wait for message processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const order = await prismaService.orders.findUnique({
        where: { order_id: result.orderId },
        include: { orderProducts: true }
      });

      expect(order).toBeDefined();
      expect(Number(order.total_paid)).toBe(199.98);
    }, 10000);
  });

  afterAll(async () => {
    // Clean up database
    await prismaService.orderProducts.deleteMany();
    await prismaService.orders.deleteMany();
    await prismaService.products.deleteMany();
    await prismaService.customers.deleteMany();
    await prismaService.orderStatus.deleteMany();
    await prismaService.orderType.deleteMany();
    await prismaService.paymentType.deleteMany();

    // Close all connections
    await prismaService.$disconnect();
    await redisService.disconnect();
    if (orderService.channelWrapper) {
      await orderService.channelWrapper.close();
    }
    if (orderConsumer.channelWrapper) {
      await orderConsumer.channelWrapper.close();
    }
    await module.close();
  });
});
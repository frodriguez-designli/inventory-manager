import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;
  let redisService: RedisService;

  const mockPrisma = {
    products: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: RedisService,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        product_name: 'Test Product',
        description: 'Test Description',
        price: new Prisma.Decimal(99.99).toString(),
        stock: 100,
        category_id: 1,
        inventory_id: 1
      };

      const mockProduct = {
        product_id: 1,
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };


      //@ts-ignore
      jest.spyOn(prismaService.products, 'create').mockResolvedValue({...mockProduct});

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(prismaService.products.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return cached products if available', async () => {
      const mockProducts = {
        data: [
          { 
            product_id: 1, 
            product_name: 'Product 1',
            description: 'Description 1',
            price: new Prisma.Decimal(99.99),
            stock: 100,
            category_id: 1,
            inventory_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
          }
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };

      jest.spyOn(redisService, 'get').mockResolvedValue(mockProducts);

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
      expect(redisService.get).toHaveBeenCalled();
      expect(prismaService.products.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if no cache exists', async () => {
      const mockProducts = [
        { 
          product_id: 1, 
          product_name: 'Product 1',
          description: 'Description 1',
          price: new Prisma.Decimal(99.99),
          stock: 100,
          category_id: 1,
          inventory_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
      ];

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(prismaService.products, 'findMany').mockResolvedValue(mockProducts);
      jest.spyOn(prismaService.products, 'count').mockResolvedValue(1);

      const result = await service.findAll();
      
      expect(result).toEqual({
        data: mockProducts,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
      expect(prismaService.products.findMany).toHaveBeenCalled();
      expect(redisService.set).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = {
        product_id: 1,
        product_name: 'Test Product',
        description: 'Test Description',
        price: new Prisma.Decimal(99.99),
        stock: 100,
        category_id: 1,
        inventory_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      jest.spyOn(prismaService.products, 'findUnique').mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(prismaService.products.findUnique).toHaveBeenCalledWith({
        where: { product_id: 1 },
      });
    });

    it('should throw a NotFoundException for a non-existent product', async () => {

      jest.spyOn(prismaService.products, 'findUnique').mockResolvedValue(null);
    
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Product with id 999 not found')
      );
    });
    
  });
});
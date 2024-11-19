import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './entities/product.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductService {
  private readonly CACHE_TTL = 3600;
  constructor(private readonly prisma: PrismaService,   private readonly redisService: RedisService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.products.create({data:createProductDto});
  }


  async findAll(page = 1, limit = 10, filters = {}) {
    const cacheKey = `products:${page}:${limit}:${JSON.stringify(filters)}`;
    
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filters,
      }),
      this.prisma.products.count({ where: filters })
    ]);

    const result = {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    await this.redisService.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  findOne(id: number) {
    return this.prisma.products.findUnique({
      where: {
        product_id: id
      }
    });
  }

  update(id: number, updateProductDto: Partial<UpdateProductDto>) {
    return this.prisma.products.update({
      where: {
        product_id: id
      },
      data: updateProductDto
    });
  }



  remove(id: number) {
    return this.prisma.products.delete({where:{
      product_id:id
    }});;
  }
}

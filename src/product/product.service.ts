import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.products.create({data:createProductDto});
  }

  findAll() {
    return this.prisma.products.findMany();
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

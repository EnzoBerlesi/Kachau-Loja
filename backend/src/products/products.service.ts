import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return await this.prisma.product.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.product.findMany({ include: { category: true } });
  }

  async findByCategory(categoryId: string) {
    return await this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
  }

  async findByCategoryName(categoryName: string) {
    return await this.prisma.product.findMany({
      where: {
        category: {
          name: {
            contains: categoryName,
            mode: 'insensitive', // busca case-insensitive
          },
        },
      },
      include: { category: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return await this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.product.delete({ where: { id } });
  }
}

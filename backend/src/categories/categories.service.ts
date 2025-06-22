import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return await this.prisma.category.create({ 
      data: { 
        ...dto, 
        description: dto.description ?? '' 
      } 
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({ include: { products: true } });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { products: true } });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return await this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.category.delete({ where: { id } });
  }
}

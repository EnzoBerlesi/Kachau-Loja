import {
  Controller, Post, Body, UseGuards, Request, BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrderStatus } from '../orders/dto/update-order-status.dto';

@Controller('checkout')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CheckoutController {
  constructor(private prisma: PrismaService) {}

  @Roles('CUSTOMER')
  @Post()
  async checkout(@Request() req, @Body() dto: CreateOrderDto) {
    const userId = req.user.userId;

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Carrinho vazio');
    }

    let total = 0;
    const itemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Produto ID ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para ${product.name}`);
      }

      total += product.price * item.quantity;

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Criar pedido com itens e atualizar estoque
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: OrderStatus.PENDING,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of itemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      message: 'Pedido criado com sucesso!',
      order,
    };
  }
}

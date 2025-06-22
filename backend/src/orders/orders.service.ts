import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    let total = 0;
    const itemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Produto ${item.productId} não encontrado`);
      if (product.stock < item.quantity) throw new BadRequestException(`Estoque insuficiente para ${product.name}`);

      total += product.price * item.quantity;

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Criar pedido + itens em transação
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          total,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Atualizar estoque dos produtos
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

      return order;
    });
  }

  async findOrdersByUser(userId: string) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllOrders() {
    return await this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneOrder(userId: string, orderId: string, isAdmin: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Acesso negado a este pedido');
    }

    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pedido não encontrado');

    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}

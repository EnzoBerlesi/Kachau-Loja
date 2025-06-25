import {
  Controller, Get, Post, Body, Param, Put, UseGuards, Request
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('CUSTOMER')
  @Post()
  async create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @Roles('ADMIN')
  @Post('admin')
  async createForCustomer(@Body() dto: CreateAdminOrderDto) {
    return this.ordersService.createOrder(dto.customerId, { items: dto.items });
  }

  @Roles('CUSTOMER')
  @Get('my')
  async findMyOrders(@Request() req) {
    return this.ordersService.findOrdersByUser(req.user.userId);
  }

  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.ordersService.findOneOrder(req.user.userId, id, isAdmin);
  }

  @Roles('ADMIN')
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  
}

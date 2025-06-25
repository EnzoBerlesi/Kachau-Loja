import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  async getProfile(@Req() req: Request) {
    const userId = req.user?.['sub'];
    if (!userId) {
      throw new Error('User information not found in request');
    }
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(@Query('role') role?: 'ADMIN' | 'CUSTOMER') {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }
}

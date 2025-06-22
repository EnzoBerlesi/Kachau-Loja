import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    const userId = req.user?.['sub']; 
    if (!userId) {
      throw new Error('User information not found in request');
    }
    return this.usersService.findById(userId);
  }
}

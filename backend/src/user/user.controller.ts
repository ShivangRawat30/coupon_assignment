import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: { email: string, walletAddress: string }) {
    return this.userService.create(createUserDto);
  }

  @Get(':id/coupons')
  async getUserCoupons(@Param('id') id: string) {
    return this.userService.getUserCoupons(id);
  }

  @Get('/:id/user')
  async getUserByWalletAddress(@Param('id') id: string) {
    return this.userService.getUserByWalletAddress(id);
  }
}


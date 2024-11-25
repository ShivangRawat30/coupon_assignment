import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { CouponService } from './coupon.service';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(@Body() createCouponDto: { organizationId: string; userId: string; amount: number }) {
    return this.couponService.create(createCouponDto);
  }

  @Put(':id/link')
  async linkToWallet(@Param('id') id: string, @Body() linkWalletDto: { walletAddress: string }) {
    return this.couponService.linkToWallet(id, linkWalletDto.walletAddress);
  }

  @Put(':id/use')
  async useCoupon(@Param('id') id: string) {
    return this.couponService.useCoupon(id);
  }
}


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel('Coupon') private couponModel: Model<Coupon>,
  ) {}

  async create(createCouponDto: { organizationId: string; userId: string; amount: number }): Promise<Coupon> {
    const createdCoupon = new this.couponModel(createCouponDto);
    return createdCoupon.save();
  }

  async linkToWallet(couponId: string, walletAddress: string): Promise<Coupon> {
    // In a real application, you would update the blockchain state here
    return this.couponModel.findByIdAndUpdate(couponId, { walletAddress }, { new: true });
  }

  async useCoupon(couponId: string): Promise<Coupon> {
    return this.couponModel.findByIdAndUpdate(couponId, { used: true }, { new: true });
  }
}


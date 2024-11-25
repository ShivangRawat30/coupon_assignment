import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Coupon } from '../coupon/coupon.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Coupon') private couponModel: Model<Coupon>, // Inject CouponModel
  ) {}

  async create(createUserDto: { email: string, walletAddress: string }): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUserCoupons(email: string): Promise<Coupon[]> {
    return this.couponModel.find({ userId: email }).exec();
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.userModel.findOne({ walletAddress: walletAddress }).exec();
  }
}

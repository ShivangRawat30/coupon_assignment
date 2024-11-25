import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CouponSchema } from 'src/coupon/coupon.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Coupon', schema: CouponSchema }])
      ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}


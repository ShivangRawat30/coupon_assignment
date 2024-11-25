import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coupon extends Document {
  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  used: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);


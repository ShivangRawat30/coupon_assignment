import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './organization.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Organization', schema: OrganizationSchema }])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}


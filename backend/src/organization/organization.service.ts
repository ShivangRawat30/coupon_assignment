import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') private organizationModel: Model<Organization>,
  ) {}

  async create(createOrganizationDto: { name: string; adminId: string }): Promise<Organization> {
    const createdOrganization = new this.organizationModel(createOrganizationDto);
    return createdOrganization.save();
  }

  async getOrg(adminId: string ): Promise<Organization[] | null> {
    return this.organizationModel.find({ adminId }).exec();
  }
  
}


import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() createOrganizationDto: { name: string; adminId: string }) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get(':adminId/org')
  async getOrg(@Param('adminId') adminId: string) {
    return this.organizationService.getOrg(adminId);
  }
}


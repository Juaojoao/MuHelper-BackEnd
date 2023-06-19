import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuidesService } from './guides.service';
import { ReturnGuidesDto } from './dtos/returnGuides.dto';
import { Guide } from '@prisma/client';
import { GuideDto } from './dtos/guides.dto';
import { Roles } from '../decorator/roles.decorator';
import { TypesRoles } from '../user/enum/role.enum';

@Roles(TypesRoles.Admin)
@Controller('guides')
export class GuidesController {
  constructor(private readonly guideServices: GuidesService) {}

  @Get()
  async getAllGuides(): Promise<ReturnGuidesDto[]> {
    const guides = await this.guideServices.getAllGuides();

    return guides.map((guide) => ({
      id: guide.id,
      title: guide.title,
    }));
  }

  @Get('/:id')
  async getGuideById(@Param('id') id: number): Promise<Guide> {
    return await this.guideServices.getGuideById(id);
  }

  @Post()
  async createGuide(@Body() guideDto: GuideDto): Promise<Guide> {
    return await this.guideServices.createGuide(guideDto);
  }

  @Patch('/:id')
  async updateGuide(
    @Param('id') id: number,
    @Body() guideDto: GuideDto,
  ): Promise<Guide> {
    return await this.guideServices.updateGuide(guideDto, id);
  }

  @Delete('/:id')
  async deleteGuide(@Param('id') id: number) {
    return await this.guideServices.deleteGuide(id);
  }
}

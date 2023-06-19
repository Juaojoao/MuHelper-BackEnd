import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GuideDto } from './dtos/guides.dto';
import { Guide } from '@prisma/client';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async getAllGuides(): Promise<Guide[]> {
    return await this.prisma.guide.findMany();
  }

  async getGuideById(id: number) {
    const guide = await this.prisma.guide.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }

  async createGuide(guideDto: GuideDto): Promise<Guide> {
    const { title, description, npcID, materials, steps, images, notes } =
      guideDto;

    const guide = await this.prisma.guide.create({
      data: {
        title: title,
        description: description,
        npcID: npcID,
        materials: materials,
        steps: steps,
        image: {
          create: images.map((image) => ({
            image: image,
          })),
        },
        notes: notes,
      },
    });

    return guide;
  }

  async updateGuide(guideDto: GuideDto, id: number): Promise<Guide> {
    const updateGuide = await this.prisma.guide.update({
      where: { id: Number(id) },
      data: guideDto,
    });

    if (!updateGuide) {
      throw new NotFoundException('Guide not found');
    }

    return updateGuide;
  }

  async deleteGuide(id: number): Promise<String> {
    const guide = await this.prisma.guide.delete({
      where: {
        id: Number(id),
      },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return 'Guide deleted';
  }
}

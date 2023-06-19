import { Test, TestingModule } from '@nestjs/testing';
import { GuidesService } from '../guides.service';
import { PrismaService } from '../../prisma/prisma.service';
import { guideMock, patchGuideMock } from '../__mocks__/guides.mock';
import { NotFoundError } from '@prisma/client/runtime';
import { NotFoundException } from '@nestjs/common';

describe('GuidesService', () => {
  let service: GuidesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuidesService,
        {
          provide: PrismaService,
          useValue: {
            guide: {
              findMany: jest.fn().mockResolvedValue(guideMock),
              findUnique: jest.fn().mockResolvedValue(guideMock.id),
              create: jest.fn().mockResolvedValue(guideMock),
              update: jest.fn().mockResolvedValue(patchGuideMock),
              delete: jest.fn().mockResolvedValue(guideMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GuidesService>(GuidesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return me all the registered guides', async () => {
    const result = await service.getAllGuides();

    expect(result).toEqual(guideMock);
  });

  it('should give me an error if the search is different', async () => {
    jest.spyOn(prismaService.guide, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.getGuideById(guideMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return me the guide with the id', async () => {
    const result = await service.getGuideById(guideMock.id);

    expect(result).toEqual(guideMock.id);
  });

  it('should create a new guide', async () => {
    const createSpy = jest
      .spyOn(prismaService.guide, 'create')
      .mockResolvedValueOnce(guideMock);

    const result = await service.createGuide(guideMock);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        title: guideMock.title,
        description: guideMock.description,
        npcID: guideMock.npcID,
        materials: guideMock.materials,
        steps: guideMock.steps,
        image: {
          create: guideMock.images.map((image) => ({
            image: image,
          })),
        },
        notes: guideMock.notes,
      },
    });
    expect(result).toEqual(guideMock);
  });

  it('should update a guide', async () => {
    const updateSpy = jest
      .spyOn(prismaService.guide, 'update')
      .mockResolvedValueOnce(patchGuideMock);

    const result = await service.updateGuide(patchGuideMock, guideMock.id);

    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: patchGuideMock.id },
      data: {
        id: patchGuideMock.id,
        title: patchGuideMock.title,
        description: patchGuideMock.description,
        npcID: patchGuideMock.npcID,
        materials: patchGuideMock.materials,
        steps: patchGuideMock.steps,
        images: patchGuideMock.images,
        notes: patchGuideMock.notes,
        createdAt: patchGuideMock.createdAt,
        updatedAt: patchGuideMock.updatedAt,
      },
    });
    expect(result).toEqual(patchGuideMock);
  });

  it('should give me an error if the search is different', async () => {
    jest.spyOn(prismaService.guide, 'update').mockResolvedValueOnce(null);

    await expect(
      service.updateGuide(patchGuideMock, guideMock.id),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a guide', async () => {
    const deleteSpy = jest
      .spyOn(prismaService.guide, 'delete')
      .mockResolvedValueOnce(guideMock);

    const result = await service.deleteGuide(guideMock.id);

    expect(deleteSpy).toHaveBeenCalledWith({
      where: { id: guideMock.id },
    });
    expect(result).toEqual('Guide deleted');
  });

  it('should give me an error if the search is different', async () => {
    jest.spyOn(prismaService.guide, 'delete').mockResolvedValueOnce(null);

    await expect(service.deleteGuide(guideMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UserMock,
  CreateUserMock,
  ReturnUserMock,
} from '../__mocks__/user.mock';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue(UserMock),
              findUnique: jest.fn().mockResolvedValue(null), // Return null for non-existing user
              create: jest.fn().mockResolvedValue(UserMock),
              findFirst: jest.fn().mockResolvedValue(UserMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should all users', async () => {
    const result = await service.getAllUsers();
    expect(result).toEqual(UserMock);
  });

  it('should create a new user', async () => {
    const createSpy = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValueOnce(UserMock);

    const result = await service.createUser(CreateUserMock);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        email: CreateUserMock.email,
        password: expect.any(String),
        typeUser: CreateUserMock.typeUser,
      },
    });
    expect(result).toEqual(ReturnUserMock);
  });

  it('should throw NotFoundException when user already exists', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(UserMock);

    await expect(service.createUser(CreateUserMock)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get user by email', async () => {
    const result = await service.getUserByEmail(UserMock.email);
    expect(result).toEqual(UserMock);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null); // Return null for non-existing user

    await expect(service.getUserByEmail(UserMock.email)).rejects.toThrow(
      NotFoundException,
    );
  });
});

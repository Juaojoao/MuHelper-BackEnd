import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { jwtMock } from '../__mocks__/jwt.mock';
import { UserMock } from '../../user/__mocks__/user.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn().mockResolvedValue(UserMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if password and email valid', async () => {
    await expect(service.validateUser(UserMock)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return user if password invalid and email valid', async () => {
    expect(
      service.validateUser({ ...UserMock, password: '4324' }),
    ).rejects.toThrowError();
  });

  it('should return error in UserService', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockRejectedValue(new Error());

    expect(service.validateUser(UserMock)).rejects.toThrowError();
  });
});

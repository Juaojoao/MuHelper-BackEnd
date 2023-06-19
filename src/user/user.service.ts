import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/createUser.dto';
import { hash } from 'bcrypt';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async createUser(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const { email, password, typeUser } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new NotFoundException('Usuário já cadastrado');
    }

    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        typeUser: typeUser,
      },
    });

    return {
      id: user.id,
      email: user.email,
      typeUser: user.typeUser,
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}

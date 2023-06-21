import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdatePasswordDTO } from './dtos/updatePassword.dto';
import { compare, hash } from 'bcrypt';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { log } from 'console';

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

  async getUserById(id: number): Promise<ReturnUserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      typeUser: user.typeUser,
    };
  }

  async updatePassword(
    id: number,
    UpdatePasswordDTO: UpdatePasswordDTO,
  ): Promise<void> {
    const { lastPassword, newPassword } = UpdatePasswordDTO;

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isMatch = await compare(lastPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Senha atual inválida');
    }

    const hashedPassword = await hash(newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findUserById(userId: number): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId, // Fornecer o ID do usuário
      },
    });

    if (!user.id) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}

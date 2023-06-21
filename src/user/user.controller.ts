import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDTO } from './dtos/updatePassword.dto';
import { Roles } from '../decorator/roles.decorator';
import { TypesRoles } from './enum/role.enum';
import { UserId } from './../decorator/user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      typeUser: user.typeUser,
    }));
  }

  @Get('/:id')
  @Roles(TypesRoles.Admin)
  async getUserById(@Param('id') id: number): Promise<ReturnUserDto> {
    return await this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles(TypesRoles.Admin)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch('/:id/password')
  @Roles(TypesRoles.Admin)
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Param('id') id: number,
    @Body() UpdatePasswordDTO: UpdatePasswordDTO,
  ) {
    return await this.userService.updatePassword(id, UpdatePasswordDTO);
  }

  @Delete('/:id')
  @Roles(TypesRoles.Admin)
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }

  @Get()
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDto> {
    const user = await this.userService.findUserById(userId);
    console.log(user);
    return user;
  }
}

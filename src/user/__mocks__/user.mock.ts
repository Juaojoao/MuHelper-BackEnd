import { User } from '@prisma/client';
import { TypesRoles } from '../enum/role.enum';
import { CreateUserDto } from '../dtos/createUser.dto';

export const UserMock: User = {
  id: 1,
  email: 'account1@muhelper.com',
  password: '123',
  typeUser: TypesRoles.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ReturnUserMock = {
  id: 1,
  email: UserMock.email,
  typeUser: UserMock.typeUser,
};

export const CreateUserMock: CreateUserDto = {
  email: 'account2@muhelper.com',
  password: UserMock.password,
  typeUser: UserMock.typeUser,
};

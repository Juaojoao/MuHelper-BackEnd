import { UserMock } from '../../user/__mocks__/user.mock';
import { LoginDto } from '../dtos/authLogin.dto';

export const userMock: LoginDto = {
  email: UserMock.email,
  password: 'abc',
};

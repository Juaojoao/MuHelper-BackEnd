import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/authLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { loginPayloadDto } from './dtos/loginPayload.dto';
import { returnLoginDto } from './dtos/returnLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<returnLoginDto> {
    const user = await this.userService.getUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = new loginPayloadDto(user).toJSON();
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        typeUser: user.typeUser,
      },
      acessToken: token,
    };
  }
}

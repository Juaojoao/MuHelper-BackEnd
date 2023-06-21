import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/authLogin.dto';
import { returnLoginDto } from './dtos/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async login(@Body() loginDto: LoginDto): Promise<returnLoginDto> {
    const user = await this.authService.validateUser(loginDto);
    return user;
  }
}

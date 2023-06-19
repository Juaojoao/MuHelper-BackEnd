import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { loginPayloadDto } from '../auth/dtos/loginPayload.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { TypesRoles } from '../user/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<TypesRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { autorization } = context.switchToHttp().getRequest().headers;

    const loginPayloadDto: loginPayloadDto | undefined = await this.jwtService
      .verifyAsync(autorization, {
        secret: process.env.JWT_SECRET,
      })
      .catch(() => undefined);

    if (!loginPayloadDto) {
      return false;
    }

    return requiredRoles.some((role) => loginPayloadDto.typeUser === role);
  }
}

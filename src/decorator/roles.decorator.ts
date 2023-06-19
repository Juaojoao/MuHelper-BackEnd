import { SetMetadata } from '@nestjs/common';
import { TypesRoles } from '../user/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TypesRoles[]) => SetMetadata(ROLES_KEY, roles);

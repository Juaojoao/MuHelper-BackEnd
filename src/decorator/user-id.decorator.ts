import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { authorizantionToLoginPayload } from 'src/util/base-64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = authorizantionToLoginPayload(authorization);

  if (!loginPayload) {
    return undefined;
  }

  return loginPayload?.id;
});

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = new UserEntity();
  user.id = 1;
  user.name = 'Monte';
  user.phone = '13486827301';
  return req.user || user;
});

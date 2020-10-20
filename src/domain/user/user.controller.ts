import { Controller, Get } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('info')
  async getInfo(@User() user: UserEntity) {
    return await this.userService.getPointInfo(user);
  }
}

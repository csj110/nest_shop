import { Controller, Get, Post, UseFilters, UseGuards, Body } from '@nestjs/common';
import { AddrService } from './addr.service';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AddrDto } from 'src/dto/addr.dto';

@Controller('addr')
export class AddrController {
  constructor(private addrService: AddrService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAddr(@User() user: UserEntity) {
    return await this.addrService.findAll(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async addAddr(@User() user: UserEntity, @Body() addr: AddrDto) {
    return await this.addrService.addAddr(addr, user);
  }
}

import { Controller, Get, Post, UseGuards, Body, Param, Patch, Delete } from '@nestjs/common';
import { AddrService } from './addr.service';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AddrDto } from 'src/dto/addr.dto';
import { AddrPostEntity } from 'src/entities/addr/address.entity';

@Controller('addr')
export class AddrController {
  constructor(private addrService: AddrService) {}

  @Get()
  async getAddr(@User() user: UserEntity) {
    return await this.addrService.findAll(user);
  }

  @Post()
  async addAddr(@User() user: UserEntity, @Body() addr: AddrDto) {
    console.log(addr);
    return await this.addrService.addAddr(addr, user);
  }

  @Patch(':id')
  async editAddr(@Param('id') id: number, @Body() addr: AddrDto, @User() user: UserEntity) {
    return await this.addrService.modifyAddr(id, addr, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @User() user: UserEntity) {
    return await this.addrService.deleteAddr(id, user);
  }
}

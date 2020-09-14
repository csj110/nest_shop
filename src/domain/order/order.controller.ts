import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { OrderCreateDto } from 'src/dto/order.dto';
import { UserEntity } from 'src/entities/user.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/shop/:shopId')
  async create(@Param('shopId') shopId: number, @Body() orderCreateDto: OrderCreateDto, @User() user: UserEntity) {
    await this.orderService.createOrder(orderCreateDto, user, shopId);
  }
}

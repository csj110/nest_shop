import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { retryWhen } from 'rxjs/operators';
import { User } from 'src/decorators/user.decorator';
import { OrderCreateDto } from 'src/dto/order.dto';
import { UserEntity } from 'src/entities/user.entity';
import { OrderService } from './order.service';

const pipInt = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE });

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  async create(@Body() orderCreateDto: OrderCreateDto, @User() user: UserEntity) {
    console.log(orderCreateDto);
    // await this.orderService.createOrder(orderCreateDto, user);
  }

  @Put('/pay/:orderId')
  async pay(@Param('orderId') orderId: number, @User() user: UserEntity) {
    await this.orderService.checkoutOrders(orderId, user);
  }

  @Get('/log/:orderId')
  async getLog(@Param('orderId') orderId: number, @User() user: UserEntity) {
    return await this.orderService.getLog(orderId, user);
  }

  @Get('/state/:orderId')
  async getState(@Param('orderId') orderId: number, @User() user: UserEntity) {
    return await this.orderService.getState(orderId, user);
  }

  @Get('')
  async getOrders(
    @Query('pageNo', pipInt) page: number,
    @Query('pageSize', pipInt) perPage: number,
    @Query('state') state: any,
    @User() user: UserEntity
  ) {
    if (state) state = parseInt(state);
    return await this.orderService.getOrders(page, perPage, state, user);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number, @User() user: UserEntity) {
    return await this.orderService.getOrder(orderId, user);
  }

  @Delete('/:orderId')
  async cancelOrder(@Param('orderId') orderId: number, @User() user: UserEntity) {
    return await this.orderService.cancelOrder(orderId, user);
  }
}

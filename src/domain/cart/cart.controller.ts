import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CartAddDto } from 'src/dto/cart.dto';
import { UserEntity } from 'src/entities/user.entity';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('addProd')
  async addProd(@Body() cartAddDto: CartAddDto, @User() user: UserEntity) {
    return await this.cartService.addToCart(cartAddDto.prodId, user, cartAddDto.number);
  }

  @Delete('shop/:shopId')
  async clear(@Param('shopId') shopId: number, @User() user: UserEntity) {
    return this.cartService.clearMyCart(user, shopId);
  }
}

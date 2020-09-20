export class ShopCartVo {
  id: number
  name: string
  cart: CartItemVo[]
}

class CartItemVo {
  pname: string
  price: number
  inventory: number
  number: number
}
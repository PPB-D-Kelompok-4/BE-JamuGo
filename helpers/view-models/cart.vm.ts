import { CartInputDTO, CartUpdateDTO, CartResultDTO, CartItemInputDTO, CartItemUpdateDTO, CartItemResultDTO } from '../dtos/cart.dto';

export class CartInputVM {
  cartData: CartInputDTO;

  constructor(cartData: CartInputDTO) {
    this.cartData = cartData;
  }
}

export class CartUpdateVM {
  cartData: CartUpdateDTO;

  constructor(cartData: CartUpdateDTO) {
    this.cartData = cartData;
  }
}

export class CartResultVM {
  result: CartResultDTO;

  constructor(result: CartResultDTO) {
    this.result = result;
  }
}

export class CartItemInputVM {
  cartItemData: CartItemInputDTO;

  constructor(cartItemData: CartItemInputDTO) {
    this.cartItemData = cartItemData;
  }
}

export class CartItemUpdateVM {
  cartItemData: CartItemUpdateDTO;

  constructor(cartItemData: CartItemUpdateDTO) {
    this.cartItemData = cartItemData;
  }
}

export class CartItemResultVM {
  result: CartItemResultDTO;

  constructor(result: CartItemResultDTO) {
    this.result = result;
  }
}
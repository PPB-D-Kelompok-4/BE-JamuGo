import {
  CartResultDTO,
  CartItemInputDTO,
  CartItemResultDTO,
} from '../dtos/cart.dto';

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

export class CartItemResultVM {
  result: CartItemResultDTO;

  constructor(result: CartItemResultDTO) {
    this.result = result;
  }
}

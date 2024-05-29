export interface CartInputDTO {
  user_pkid: number;
}

export interface CartUpdateDTO {
  user_pkid?: number;
  total_price?: number;
}

export interface CartResultDTO {
  pkid: number;
  user_pkid: number;
  total_price: number;
  items?: CartItemResultDTO[];
}

export interface CartItemInputDTO {
  cart_pkid: number;
  menu_pkid: number;
  quantity: number;
}

export interface CartItemUpdateDTO {
  quantity?: number;
  price?: number;
}

export interface CartItemResultDTO {
  pkid: number;
  cart_pkid: number;
  menu_pkid: number;
  quantity: number;
  price: number;
}

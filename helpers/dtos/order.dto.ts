export interface OrderInputDTO {
  user_pkid: number;
  status: string;
  total_price: number;
}

export interface OrderItemInputDTO {
  order_pkid: number;
  menu_pkid: number;
  quantity: number;
  price: number;
}

export interface OrderResultDTO {
  pkid: number;
  user_pkid: number;
  status: string;
  total_price: number;
  items?: OrderItemResultDTO[];
  orderStatus?: OrderStatusResultDTO | null;
}

export interface OrderItemResultDTO {
  pkid: number;
  order_pkid: number;
  menu_pkid: number;
  quantity: number;
  price: number;
}

export interface OrderStatusResultDTO {
  pkid: number;
  order_pkid: number;
  status: string;
}

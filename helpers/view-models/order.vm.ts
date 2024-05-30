import {
  OrderInputDTO,
  OrderResultDTO,
  OrderItemInputDTO,
  OrderItemResultDTO,
  OrderStatusResultDTO,
} from '../dtos/order.dto';

export class OrderInputVM {
  orderData: OrderInputDTO;

  constructor(orderData: OrderInputDTO) {
    this.orderData = orderData;
  }
}

export class OrderResultVM {
  result: OrderResultDTO;

  constructor(result: OrderResultDTO) {
    this.result = result;
  }
}

export class OrderItemInputVM {
  orderItemData: OrderItemInputDTO;

  constructor(orderItemData: OrderItemInputDTO) {
    this.orderItemData = orderItemData;
  }
}

export class OrderItemResultVM {
  result: OrderItemResultDTO;

  constructor(result: OrderItemResultDTO) {
    this.result = result;
  }
}

export class OrderStatusResultVM {
  result: OrderStatusResultDTO;

  constructor(result: OrderStatusResultDTO) {
    this.result = result;
  }
}

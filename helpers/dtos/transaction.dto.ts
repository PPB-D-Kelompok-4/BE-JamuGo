export interface TransactionInputDTO {
  order_pkid: number;
  payment_status: string;
  payment_method: string;
  transaction_date: Date;
}

export interface TransactionResultDTO {
  pkid: number;
  order_pkid: number;
  payment_status: string;
  payment_method: string;
  transaction_date: Date;
}

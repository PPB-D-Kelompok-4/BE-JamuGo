export interface PaymentInputDTO {
  transaction_pkid: number;
  payment_gateway: string;
  payment_status: string;
  payment_amount: number;
  transaction_gateway_id: string;
  payment_date: Date;
}

export interface PaymentResultDTO {
  pkid: number;
  transaction_pkid: number;
  payment_gateway: string;
  payment_status: string;
  payment_amount: number;
  transaction_gateway_id: string;
  payment_date: Date;
}

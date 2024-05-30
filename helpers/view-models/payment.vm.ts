import { PaymentResultDTO } from '../dtos/payment.dto';

export class PaymentResultVM {
  result: PaymentResultDTO;

  constructor(payment: any) {
    this.result = {
      pkid: payment.pkid,
      transaction_pkid: payment.transaction_pkid,
      payment_gateway: payment.payment_gateway,
      payment_status: payment.payment_status,
      payment_amount: payment.payment_amount,
      transaction_gateway_id: payment.transaction_gateway_id,
      payment_date: payment.payment_date,
    };
  }
}

import { TransactionResultDTO } from '../dtos/transaction.dto';

export class TransactionResultVM {
  result: TransactionResultDTO;

  constructor(transaction: any) {
    this.result = {
      pkid: transaction.pkid,
      order_pkid: transaction.order_pkid,
      payment_status: transaction.payment_status,
      payment_method: transaction.payment_method,
      transaction_date: transaction.transaction_date,
    };
  }
}

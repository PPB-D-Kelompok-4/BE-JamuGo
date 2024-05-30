import { Request } from 'express';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { BaseService } from '../common/base.service';
import { TransactionAttributes } from '../../infrastructure/models/transaction.model';
import { CreationAttributes, Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { checkAdminRole } from '../../helpers/utility/checkAdminRole';

export class TransactionService extends BaseService<Model<TransactionAttributes>> {
  private transactionRepository: TransactionRepository;

  constructor() {
    super(new TransactionRepository());
    this.transactionRepository = new TransactionRepository();
  }

  public async getTransactionById(req: Request, pkid: number): Promise<Model<TransactionAttributes> | null> {
    return await this.transactionRepository.findByID(req, pkid);
  }

  public async getTransactionsByOrderId(req: Request, orderPkid: number): Promise<Model<TransactionAttributes>[]> {
    return await this.transactionRepository.where(req, { order_pkid: orderPkid });
  }

  public async updateTransactionStatus(req: Request, pkid: number, status: string): Promise<[number, Model<TransactionAttributes>[]]> {
    await checkAdminRole(req);  // Ensure only admin can update status

    const transaction = await this.transactionRepository.findByID(req, pkid);
    if (!transaction) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    transaction.setDataValue('payment_status', status);
    await transaction.save();

    return [1, [transaction]];
  }

  public async updateTransactionPaymentMethod(req: Request, pkid: number, paymentMethod: string): Promise<[number, Model<TransactionAttributes>[]]> {
    const transaction = await this.transactionRepository.findByID(req, pkid);
    if (!transaction) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    transaction.setDataValue('payment_method', paymentMethod);
    await transaction.save();

    return [1, [transaction]];
  }
}

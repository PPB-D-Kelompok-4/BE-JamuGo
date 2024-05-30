import { Request } from 'express';
import { PaymentRepository } from '../../data-access/repositories/payment.repository';
import { BaseService } from '../common/base.service';
import { PaymentAttributes } from '../../infrastructure/models/payment.model';
import { CreationAttributes, Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class PaymentService extends BaseService<Model<PaymentAttributes>> {
  private paymentRepository: PaymentRepository;

  constructor() {
    super(new PaymentRepository());
    this.paymentRepository = new PaymentRepository();
  }

  public async createPayment(req: Request, paymentData: CreationAttributes<Model<PaymentAttributes>>): Promise<Model<PaymentAttributes>> {
    return await this.paymentRepository.create(req, paymentData) as Model<PaymentAttributes>;
  }

  public async getPaymentById(req: Request, pkid: number): Promise<Model<PaymentAttributes> | null> {
    return await this.paymentRepository.findByID(req, pkid);
  }

  public async updatePaymentStatus(req: Request, pkid: number, status: string): Promise<[number, Model<PaymentAttributes>[]]> {
    const payment = await this.paymentRepository.findByID(req, pkid);
    if (!payment) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    payment.setDataValue('payment_status', status);
    await payment.save();

    return [1, [payment]];
  }

  // Other methods...
}

import { Request } from 'express';
import { PaymentRepository } from '../../data-access/repositories/payment.repository';
import { BaseService } from '../common/base.service';
import { PaymentAttributes } from '../../infrastructure/models/payment.model';
import { CreationAttributes, Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import coreApi from '../../infrastructure/config/midtrans';
import { OrderRepository } from '../../data-access/repositories/order.repository';

export class PaymentService extends BaseService<Model<PaymentAttributes>> {
  private paymentRepository: PaymentRepository;
  private orderRepository: OrderRepository;

  constructor() {
    super(new PaymentRepository());
    this.paymentRepository = new PaymentRepository();
    this.orderRepository = new OrderRepository();
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

  public async initiateTransaction(req: Request, orderPkid: number): Promise<any> {
    const user = (req as any).user;
    const order = await this.orderRepository.findByID(req, orderPkid);

    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const parameter = {
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id: order.getDataValue('pkid').toString(),
        gross_amount: order.getDataValue('total_price'),
      },
      customer_details: {
        email: user.email,
        name: user.name,
      },
    };

    try {
      return await coreApi.charge(parameter);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getMessage(req, MessagesKey.INTERNALSERVERERROR) + ': ' + error.message);
      } else {
        throw new Error(getMessage(req, MessagesKey.INTERNALSERVERERROR) + ': ' + String(error));
      }
    }
  }
}

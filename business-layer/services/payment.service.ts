import { Request } from 'express';
import { PaymentRepository } from '../../data-access/repositories/payment.repository';
import { BaseService } from '../common/base.service';
import { PaymentAttributes } from '../../infrastructure/models/payment.model';
import { CreationAttributes, Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { coreApi, snap } from '../../infrastructure/config/midtrans';
import { OrderRepository } from '../../data-access/repositories/order.repository';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { OrderHeaderStatus } from '../../helpers/enum/orderHeaderStatus.enum';
import { PaymentStatus } from '../../helpers/enum/payment.enum';

export class PaymentService extends BaseService<Model<PaymentAttributes>> {
  private paymentRepository: PaymentRepository;
  private orderRepository: OrderRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    super(new PaymentRepository());
    this.paymentRepository = new PaymentRepository();
    this.orderRepository = new OrderRepository();
    this.transactionRepository = new TransactionRepository();
  }

  public async createPayment(
    req: Request,
    paymentData: CreationAttributes<Model<PaymentAttributes>>,
  ): Promise<Model<PaymentAttributes>> {
    return (await this.paymentRepository.create(
      req,
      paymentData,
    )) as Model<PaymentAttributes>;
  }

  public async getPaymentById(
    req: Request,
    pkid: number,
  ): Promise<Model<PaymentAttributes> | null> {
    return await this.paymentRepository.findByID(req, pkid);
  }

  public async updatePaymentStatus(
    req: Request,
    pkid: number,
    status: string,
  ): Promise<[number, Model<PaymentAttributes>[]]> {
    const payment = await this.paymentRepository.findByID(req, pkid);
    if (!payment) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    payment.setDataValue('payment_status', status);
    await payment.save();

    return [1, [payment]];
  }

  private async updateOrderAndTransactionStatus(
    req: Request,
    orderPkid: number,
  ): Promise<void> {
    // Update OrderHeaderStatus to 'Process'
    const order = await this.orderRepository.findByID(req, orderPkid);
    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    order.setDataValue('status', OrderHeaderStatus.Process);
    await order.save();

    // Update Transaction status to 'Completed'
    const transaction = await this.transactionRepository.where(req, {
      order_pkid: orderPkid,
    });

    if (transaction.length === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    transaction[0].setDataValue('payment_status', PaymentStatus.Completed);
    await transaction[0].save();
  }

  public async initiateTransaction(
    req: Request,
    orderPkid: number,
  ): Promise<any> {
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
      const response = await coreApi.charge(parameter);
      await this.updateOrderAndTransactionStatus(req, orderPkid);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.INTERNALSERVERERROR) +
          ': ' +
          error.message,
        );
      } else {
        throw new Error(
          getMessage(req, MessagesKey.INTERNALSERVERERROR) +
          ': ' +
          String(error),
        );
      }
    }
  }

  public async initiateSnapTransaction(
    req: Request,
    orderPkid: number,
  ): Promise<any> {
    const user = (req as any).user;
    const order = await this.orderRepository.findByID(req, orderPkid);

    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const parameter = {
      transaction_details: {
        order_id: order.getDataValue('pkid').toString(),
        gross_amount: order.getDataValue('total_price'),
      },
      customer_details: {
        email: user.email,
        name: user.name,
      },
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: 'https://your-frontend-app-url.com/finish',
      },
    };

    try {
      const response = await snap.createTransaction(parameter);
      await this.updateOrderAndTransactionStatus(req, orderPkid);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.INTERNALSERVERERROR) +
          ': ' +
          error.message,
        );
      } else {
        throw new Error(
          getMessage(req, MessagesKey.INTERNALSERVERERROR) +
          ': ' +
          String(error),
        );
      }
    }
  }
}

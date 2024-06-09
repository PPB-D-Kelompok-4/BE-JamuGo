import { Request } from 'express';
import { OrderRepository } from '../../data-access/repositories/order.repository';
import { OrderItemRepository } from '../../data-access/repositories/orderItem.repository';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { CartRepository } from '../../data-access/repositories/cart.repository';
import { CartItemRepository } from '../../data-access/repositories/cartItem.repository';
import { OrderStatusRepository } from '../../data-access/repositories/orderStatus.repository';
import { OrderAttributes } from '../../infrastructure/models/order.model';
import { BaseService } from '../common/base.service';
import {
  OrderInputDTO,
  OrderItemInputDTO,
  OrderItemResultDTO,
  OrderResultDTO,
  OrderStatusResultDTO,
} from '../../helpers/dtos/order.dto';
import {
  OrderInputVM,
  OrderItemInputVM,
} from '../../helpers/view-models/order.vm';
import {
  CreationAttributes,
  FindOptions,
  Model,
  WhereOptions,
} from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { OrderItemAttributes } from '../../infrastructure/models/orderItem.model';
import { OrderHeaderStatus } from '../../helpers/enum/orderHeaderStatus.enum';
import { OrderStatus } from '../../helpers/enum/orderStatus.enum';
import { OrderStatusAttributes } from '../../infrastructure/models/orderStatus.model';
import { TransactionRepository } from '../../data-access/repositories/transaction.repository';
import { TransactionAttributes } from '../../infrastructure/models/transaction.model';
import { PaymentMethod, PaymentStatus } from '../../helpers/enum/payment.enum';
import { checkAdminRole } from '../../helpers/utility/checkAdminRole';

interface OrderResultWithItemsDTO extends OrderResultDTO {
  items: OrderItemResultDTO[];
}

export class OrderService extends BaseService<Model<OrderAttributes>> {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderItemRepository;
  private userRepository: UserRepository;
  private cartRepository: CartRepository;
  private cartItemRepository: CartItemRepository;
  private orderStatusRepository: OrderStatusRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    super(new OrderRepository());
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemRepository();
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.orderStatusRepository = new OrderStatusRepository();
    this.transactionRepository = new TransactionRepository();
  }

  //region Create Method
  public async createOrder(
    req: Request,
    orderData: OrderInputDTO,
  ): Promise<OrderResultDTO> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const cart = await this.cartRepository.where(req, {
      user_pkid: dbUser.getDataValue('pkid'),
    });

    if (cart.length === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const cartItems = await this.cartItemRepository.where(req, {
      cart_pkid: cart[0].getDataValue('pkid'),
    });

    if (cartItems.length === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const total_price = cart[0].getDataValue('total_price') * 1.11; // Add 11% PPN
    orderData = {
      user_pkid: dbUser.getDataValue('pkid'),
      status: OrderHeaderStatus.Pending,
      total_price,
    };

    const orderVM = new OrderInputVM(orderData);
    const order = (await this.orderRepository.create(
      req,
      orderVM.orderData as OrderAttributes,
    )) as Model<OrderAttributes>;
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const orderItemData: OrderItemInputDTO = {
          order_pkid: order.getDataValue('pkid'),
          menu_pkid: item.getDataValue('menu_pkid'),
          quantity: item.getDataValue('quantity'),
          price: item.getDataValue('price'),
        };
        const orderItemVM = new OrderItemInputVM(orderItemData);
        const result = (await this.orderItemRepository.create(
          req,
          orderItemVM.orderItemData as OrderItemAttributes,
        )) as Model<OrderItemAttributes>;
        return result.toJSON() as OrderItemResultDTO;
      }),
    );

    await this.orderStatusRepository.create(req, {
      order_pkid: order.getDataValue('pkid'),
      status: OrderStatus.OrderPlaced,
    } as CreationAttributes<Model<OrderStatusAttributes>>);

    // Create the transaction
    const transactionData: CreationAttributes<Model<TransactionAttributes>> = {
      order_pkid: order.getDataValue('pkid'),
      payment_status: PaymentStatus.Pending,
      payment_method: PaymentMethod.Cash,
      transaction_date: new Date(),
    };
    await this.transactionRepository.create(req, transactionData);

    await this.cartItemRepository.bulkHardDelete(req, {
      cart_pkid: cart[0].getDataValue('pkid'),
    });

    await this.cartRepository.update(req, cart[0].getDataValue('pkid'), {
      total_price: 0,
    });

    const orderResult = order.toJSON() as OrderResultWithItemsDTO;
    orderResult.items = orderItems;

    return orderResult;
  }
  //endregion

  //region Read Method
  public async getOrderById(
    req: Request,
    pkid: number,
  ): Promise<OrderResultWithItemsDTO> {
    const order = await this.orderRepository.findByID(req, pkid);
    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const orderItems = await this.orderItemRepository.where(req, {
      order_pkid: order.getDataValue('pkid'),
    });

    const orderStatus = await this.orderStatusRepository.where(req, {
      order_pkid: order.getDataValue('pkid'),
    });

    const orderResult = order.toJSON() as OrderResultWithItemsDTO;
    orderResult.items = orderItems.map(
      (item) => item.toJSON() as OrderItemResultDTO,
    );
    orderResult.orderStatus = orderStatus.length
      ? (orderStatus[0].toJSON() as OrderStatusResultDTO)
      : undefined;

    return orderResult;
  }

  public async getOrdersByUser(
    req: Request,
  ): Promise<OrderResultWithItemsDTO[]> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const orders = await this.orderRepository.where(req, {
      user_pkid: dbUser.getDataValue('pkid'),
    });

    return await Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.orderItemRepository.where(req, {
          order_pkid: order.getDataValue('pkid'),
        });
        const orderStatus = await this.orderStatusRepository.where(req, {
          order_pkid: order.getDataValue('pkid'),
        });
        const orderResult = order.toJSON() as OrderResultWithItemsDTO;
        orderResult.items = orderItems.map(
          (item) => item.toJSON() as OrderItemResultDTO,
        );
        orderResult.orderStatus = orderStatus.length
          ? (orderStatus[0].toJSON() as OrderStatusResultDTO)
          : undefined;
        return orderResult;
      }),
    );
  }

  public async getLastOrderByUser(
    req: Request,
  ): Promise<OrderResultWithItemsDTO | null> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const lastOrder = await this.orderRepository.findOne(req, {
      where: { user_pkid: dbUser.getDataValue('pkid') },
      order: [['created_date', 'DESC']],
    });

    if (!lastOrder) {
      return null;
    }

    const orderItems = await this.orderItemRepository.where(req, {
      order_pkid: lastOrder.getDataValue('pkid'),
    });

    const orderStatus = await this.orderStatusRepository.where(req, {
      order_pkid: lastOrder.getDataValue('pkid'),
    });

    const orderResult = lastOrder.toJSON() as OrderResultWithItemsDTO;
    orderResult.items = orderItems.map(
      (item) => item.toJSON() as OrderItemResultDTO,
    );
    orderResult.orderStatus = orderStatus.length
      ? (orderStatus[0].toJSON() as OrderStatusResultDTO)
      : undefined;

    return orderResult;
  }

  public async getAllOrders(
    req: Request,
    status?: string,
    sortByDate?: boolean,
  ): Promise<OrderResultWithItemsDTO[]> {
    await checkAdminRole(req);

    const criteria: WhereOptions<OrderAttributes> = {};
    if (status) {
      criteria.status = status;
    }

    const options: FindOptions<OrderAttributes> = {
      where: criteria,
      order: sortByDate ? [['created_date', 'DESC']] : undefined,
    };

    const orders = await this.orderRepository.findAll(req, options);

    return await Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.orderItemRepository.where(req, {
          order_pkid: order.getDataValue('pkid'),
        });
        const orderStatus = await this.orderStatusRepository.where(req, {
          order_pkid: order.getDataValue('pkid'),
        });
        const orderResult = order.toJSON() as OrderResultWithItemsDTO;
        orderResult.items = orderItems.map(
          (item) => item.toJSON() as OrderItemResultDTO,
        );
        orderResult.orderStatus = orderStatus.length
          ? (orderStatus[0].toJSON() as OrderStatusResultDTO)
          : undefined;
        return orderResult;
      }),
    );
  }
  //endregion

  //region Update Methods
  public async cancelOrder(
    req: Request,
    pkid: number,
  ): Promise<OrderResultDTO> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const order = await this.orderRepository.findByID(req, pkid);

    if (
      !order ||
      order.getDataValue('user_pkid') !== dbUser.getDataValue('pkid')
    ) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    if (order.getDataValue('status') === OrderHeaderStatus.Cancelled) {
      throw new Error(getMessage(req, MessagesKey.ORDERALREADYCANCELLED));
    }

    order.setDataValue('status', OrderHeaderStatus.Cancelled);
    await order.save();

    await this.orderStatusRepository.create(req, {
      order_pkid: order.getDataValue('pkid'),
      status: OrderStatus.Cancelled,
    } as CreationAttributes<Model<OrderStatusAttributes>>);

    return order.toJSON() as OrderResultDTO;
  }

  public async updateOrderStatus(
    req: Request,
    pkid: number,
    status: OrderStatus,
  ): Promise<OrderResultDTO> {
    await checkAdminRole(req);

    const order = await this.orderRepository.findByID(req, pkid);
    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error(getMessage(req, MessagesKey.INVALIDORDERSTATUS));
    }

    order.setDataValue('status', status);
    await order.save();

    await this.orderStatusRepository.create(req, {
      order_pkid: order.getDataValue('pkid'),
      status: status,
    } as CreationAttributes<Model<OrderStatusAttributes>>);

    return order.toJSON() as OrderResultDTO;
  }

  public async updateOrderHeaderStatus(
    req: Request,
    pkid: number,
    status: OrderHeaderStatus,
  ): Promise<OrderResultDTO> {
    await checkAdminRole(req);

    const order = await this.orderRepository.findByID(req, pkid);
    if (!order) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    order.setDataValue('status', status);
    await order.save();

    return order.toJSON() as OrderResultDTO;
  }

  public async finishOrder(req: Request, pkid: number): Promise<OrderResultDTO> {
    return this.updateOrderHeaderStatus(req, pkid, OrderHeaderStatus.Completed);
  }

  public async processOrder(req: Request, pkid: number): Promise<OrderResultDTO> {
    return this.updateOrderHeaderStatus(req, pkid, OrderHeaderStatus.Process);
  }

  public async getTransactionByOrderId(
    req: Request,
    orderPkid: number,
  ): Promise<Model<TransactionAttributes>[]> {
    return await this.transactionRepository.where(req, {
      order_pkid: orderPkid,
    });
  }
  //endregion
}

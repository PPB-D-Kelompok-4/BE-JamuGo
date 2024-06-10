import { Request, Response } from 'express';
import { OrderService } from '../../business-layer/services/order.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { OrderInputDTO } from '../../helpers/dtos/order.dto';
import {
  OrderInputVM,
  OrderResultVM,
} from '../../helpers/view-models/order.vm';
import { OrderStatus } from '../../helpers/enum/orderStatus.enum';

export class OrderController extends BaseController {
  private orderService: OrderService;

  constructor() {
    super();
    this.orderService = new OrderService();
  }

  //region Create Methods

  public async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderInput = new OrderInputVM(req.body as OrderInputDTO);
      const order = await this.orderService.createOrder(
        req,
        orderInput.orderData,
      );
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessCreate(req, res, orderResultVM.result, order.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  //endregion

  //region Read Methods

  public async getOrderById(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.getOrderById(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.SUCCESSGETBYID,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getOrdersByUser(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await this.orderService.getOrdersByUser(req);
      const orderResultVMs = orders.map((order) => new OrderResultVM(order));
      return this.sendSuccessGet(
        req,
        res,
        orderResultVMs.map((vm) => vm.result),
        MessagesKey.SUCCESSGET,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllOrders(req: Request, res: Response): Promise<Response> {
    try {
      const { status, sortByDate } = req.query;
      const orders = await this.orderService.getAllOrders(
        req,
        status as string,
        sortByDate === 'true',
      );
      const orderResultVMs = orders.map((order) => new OrderResultVM(order));
      return this.sendSuccessGet(
        req,
        res,
        orderResultVMs.map((vm) => vm.result),
        MessagesKey.SUCCESSGET,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getLastOrderByUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const order = await this.orderService.getLastOrderByUser(req);
      if (!order) {
        return this.sendSuccessGet(req, res, null, MessagesKey.NODATAFOUND);
      }
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.SUCCESSGET,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTransactionByOrderId(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const orderPkid = parseInt(req.params.orderPkid);
      if (isNaN(orderPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const transactions = await this.orderService.getTransactionByOrderId(
        req,
        orderPkid,
      );
      return this.sendSuccessGet(req, res, transactions, MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  //endregion

  //region Update Methods

  public async updateOrderStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }

      const { status } = req.body;
      if (!status || !Object.values(OrderStatus).includes(status)) {
        return this.sendErrorBadRequest(req, res);
      }

      const order = await this.orderService.updateOrderStatus(
        req,
        pkid,
        status as OrderStatus,
      );
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.SUCCESSUPDATE,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async cancelOrder(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.cancelOrder(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.ORDERCANCELLED,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async cancelOrderByAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.query.pkid as string);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.cancelOrderByAdmin(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.ORDERCANCELLED,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }


  public async finishOrder(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.finishOrder(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.SUCCESSUPDATE,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async processOrder(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.processOrder(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(
        req,
        res,
        orderResultVM.result,
        MessagesKey.SUCCESSUPDATE,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  //endregion
}

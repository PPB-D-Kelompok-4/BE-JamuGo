import { Request, Response } from 'express';
import { OrderService } from '../../business-layer/services/order.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { OrderInputDTO } from '../../helpers/dtos/order.dto';
import { OrderInputVM, OrderResultVM } from '../../helpers/view-models/order.vm';

export class OrderController extends BaseController {
  private orderService: OrderService;

  constructor() {
    super();
    this.orderService = new OrderService();
  }

  public async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderInput = new OrderInputVM(req.body as OrderInputDTO);
      const order = await this.orderService.createOrder(req, orderInput.orderData);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessCreate(req, res, orderResultVM.result, order.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getOrderById(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const order = await this.orderService.getOrderById(req, pkid);
      const orderResultVM = new OrderResultVM(order);
      return this.sendSuccessGet(req, res, orderResultVM.result, MessagesKey.SUCCESSGETBYID);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getOrdersByUser(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await this.orderService.getOrdersByUser(req);
      const orderResultVMs = orders.map((order) => new OrderResultVM(order));
      return this.sendSuccessGet(req, res, orderResultVMs.map((vm) => vm.result), MessagesKey.SUCCESSGET);
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
      return this.sendSuccessGet(req, res, orderResultVM.result, MessagesKey.ORDERCANCELLED);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

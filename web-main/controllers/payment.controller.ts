import { Request, Response } from 'express';
import { PaymentService } from '../../business-layer/services/payment.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { PaymentResultVM } from '../../helpers/view-models/payment.vm';

export class PaymentController extends BaseController {
  private paymentService: PaymentService;

  constructor() {
    super();
    this.paymentService = new PaymentService();
  }

  public async createPayment(req: Request, res: Response): Promise<Response> {
    try {
      const payment = await this.paymentService.createPayment(req, req.body);
      const paymentResultVM = new PaymentResultVM(payment.toJSON());
      return this.sendSuccessCreate(req, res, paymentResultVM.result, payment.getDataValue('pkid'));
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getPaymentById(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const payment = await this.paymentService.getPaymentById(req, pkid);
      if (!payment) {
        return this.sendErrorNotFound(req, res);
      }
      const paymentResultVM = new PaymentResultVM(payment.toJSON());
      return this.sendSuccessGet(req, res, paymentResultVM.result, MessagesKey.SUCCESSGETBYID);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updatePaymentStatus(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }

      const { status } = req.body;
      const [affectedCount, affectedRows] = await this.paymentService.updatePaymentStatus(req, pkid, status);
      if (affectedCount === 0) {
        return this.sendErrorNotFound(req, res);
      }

      const paymentResultVM = new PaymentResultVM(affectedRows[0].toJSON());
      return this.sendSuccessUpdate(req, res, paymentResultVM.result, MessagesKey.SUCCESSUPDATE);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Other methods...
}

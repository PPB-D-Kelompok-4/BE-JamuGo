import { Request, Response } from 'express';
import { TransactionService } from '../../business-layer/services/transaction.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { TransactionResultVM } from '../../helpers/view-models/transaction.vm';

export class TransactionController extends BaseController {
  private transactionService: TransactionService;

  constructor() {
    super();
    this.transactionService = new TransactionService();
  }

  public async getTransactionById(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const transaction = await this.transactionService.getTransactionById(req, pkid);
      if (!transaction) {
        return this.sendErrorNotFound(req, res);
      }
      const transactionResultVM = new TransactionResultVM(transaction.toJSON());
      return this.sendSuccessGet(req, res, transactionResultVM.result, MessagesKey.SUCCESSGETBYID);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getTransactionsByOrderId(req: Request, res: Response): Promise<Response> {
    try {
      const orderPkid = parseInt(req.params.orderPkid);
      if (isNaN(orderPkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const transactions = await this.transactionService.getTransactionsByOrderId(req, orderPkid);
      const transactionResultVMs = transactions.map(transaction => new TransactionResultVM(transaction.toJSON()));
      return this.sendSuccessGet(req, res, transactionResultVMs.map(vm => vm.result), MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateTransactionStatus(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }

      const { status } = req.body;
      const [affectedCount, affectedRows] = await this.transactionService.updateTransactionStatus(req, pkid, status);
      if (affectedCount === 0) {
        return this.sendErrorNotFound(req, res);
      }

      const transactionResultVM = new TransactionResultVM(affectedRows[0].toJSON());
      return this.sendSuccessUpdate(req, res, transactionResultVM.result, MessagesKey.SUCCESSUPDATE);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateTransactionPaymentMethod(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }

      const { payment_method } = req.body;
      const [affectedCount, affectedRows] = await this.transactionService.updateTransactionPaymentMethod(req, pkid, payment_method);
      if (affectedCount === 0) {
        return this.sendErrorNotFound(req, res);
      }

      const transactionResultVM = new TransactionResultVM(affectedRows[0].toJSON());
      return this.sendSuccessUpdate(req, res, transactionResultVM.result, MessagesKey.SUCCESSUPDATE);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

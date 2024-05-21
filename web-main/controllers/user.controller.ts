import { Request, Response } from 'express';
import { UserService } from '../../business-layer/services/user.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.userService.updateUser(req, pkid, req.body);
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getFirebaseData(req: Request, res: Response): Promise<Response> {
    try {
      const firebaseData = await this.userService.getUserDataFromFirebase(req);
      return this.sendSuccessGet(req, res, firebaseData, MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      if (!email) {
        return this.sendErrorBadRequest(req, res);
      }
      const resetLink = await this.userService.resetPassword(req, email);
      return this.sendSuccessGet(req, res, { resetLink }, MessagesKey.SUCCESSRESETPASSWORD);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
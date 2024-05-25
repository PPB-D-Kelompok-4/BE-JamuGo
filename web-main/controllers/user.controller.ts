import { Request, Response } from 'express';
import { UserService } from '../../business-layer/services/user.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UserUpdateDTO } from '../../helpers/dtos/user.dto';
import { UserInputVM, UserResultVM } from '../../helpers/view-models/user.vm';

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, name, address } = req.body;
      if (!email || !password || !name) {
        return this.sendErrorBadRequest(req, res);
      }
      const userInput = new UserInputVM({ email, password, name, address });
      const user = await this.userService.register(req, userInput.userData);
      const userResultVM = new UserResultVM(user);
      return this.sendSuccessCreate(req, res, userResultVM.result, user.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return this.sendErrorBadRequest(req, res);
      }
      const token = await this.userService.login(req, { email, password });
      return this.sendSuccessGet(req, res, { token }, MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const userUpdate: UserUpdateDTO = req.body;
      const updateResult = await this.userService.updateUser(
        req,
        pkid,
        userUpdate,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getFirebaseData(req: Request, res: Response): Promise<Response> {
    try {
      const firebaseData = await this.userService.getUserDataFromFirebase(req);
      return this.sendSuccessGet(
        req,
        res,
        firebaseData,
        MessagesKey.SUCCESSGET,
      );
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
      return this.sendSuccessGet(
        req,
        res,
        { resetLink },
        MessagesKey.SUCCESSRESETPASSWORD,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async uploadProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const user = await this.userService.uploadProfileImage(req);
      const userResultVM = new UserResultVM(user);
      return this.sendSuccessUpdate(req, res, userResultVM.result);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

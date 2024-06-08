import { Request, Response } from 'express';
import { UserService } from '../../business-layer/services/user.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UserUpdateDTO } from '../../helpers/dtos/user.dto';
import {
  UserInputVM,
  UserResultVM,
  UserUpdateVM,
} from '../../helpers/view-models/user.vm';
import path from 'node:path';
import * as fs from 'fs';

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

  public async getMe(req: Request, res: Response): Promise<Response> {
    try {
      const user = (req as any).user;
      if (!user) {
        return this.sendErrorUnauthorized(req, res);
      }
      const userData = await this.userService.findByUUIDUser(req, user.uid);
      const userResultVM = new UserResultVM(userData);
      return this.sendSuccessGet(
        req,
        res,
        userResultVM.result,
        MessagesKey.SUCCESSGETBYID,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.findAllUser(req);
      const userResultVMs = users.map((user) => new UserResultVM(user));
      return this.sendSuccessGet(
        req,
        res,
        userResultVMs.map((vm) => vm.result),
        MessagesKey.SUCCESSGET,
      );
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
      const userUpdateVM = new UserUpdateVM(userUpdate);
      const updateResult = await this.userService.updateUser(
        req,
        pkid,
        userUpdateVM.userData,
      );
      const userResultVM = new UserResultVM(updateResult);
      return this.sendSuccessUpdate(req, res, userResultVM.result);
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

  public async getProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      const imagePath = path.resolve(
        __dirname,
        '../../helpers/assets/image-profiles',
        filename,
      );
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else {
        this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      this.handleError(req, res, error, 500);
    }
  }

  public async checkToken(req: Request, res: Response): Promise<Response> {
    try {
      const user = (req as any).user;
      if (!user) {
        return this.sendErrorUnauthorized(req, res);
      }
      const userData = await this.userService.findByUUIDUser(req, user.uid);
      const role = await this.userService.getUserRole(req, userData.role_pkid);
      return this.sendSuccessGet(
        req,
        res,
        { ...userData, role: role.name },
        MessagesKey.SUCCESSGET,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

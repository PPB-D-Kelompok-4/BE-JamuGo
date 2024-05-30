import { Request, Response } from 'express';
import { MenuService } from '../../business-layer/services/menu.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { MenuInputDTO, MenuUpdateDTO } from '../../helpers/dtos/menu.dto';
import {
  MenuInputVM,
  MenuResultVM,
  MenuUpdateVM,
} from '../../helpers/view-models/menu.vm';

export class MenuController extends BaseController {
  private menuService: MenuService;

  constructor() {
    super();
    this.menuService = new MenuService();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const menuInput = new MenuInputVM(req.body as MenuInputDTO);
      const menu = await this.menuService.createMenu(req, menuInput.menuData);
      const menuResultVM = new MenuResultVM(menu);
      return this.sendSuccessCreate(req, res, menuResultVM.result, menu.pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const menu = await this.menuService.getMenuById(req, pkid);
      const menuResultVM = new MenuResultVM(menu);
      return this.sendSuccessGet(
        req,
        res,
        menuResultVM.result,
        MessagesKey.SUCCESSGETBYID,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const menus = await this.menuService.getAllMenus(req);
      const menuResultVMs = menus.map((menu) => new MenuResultVM(menu));
      return this.sendSuccessGet(
        req,
        res,
        menuResultVMs.map((vm) => vm.result),
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
      const menuUpdate = new MenuUpdateVM(req.body as MenuUpdateDTO);
      const menu = await this.menuService.updateMenu(
        req,
        pkid,
        menuUpdate.menuData,
      );
      const menuResultVM = new MenuResultVM(menu);
      return this.sendSuccessUpdate(req, res, menuResultVM.result);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.menuService.deleteMenu(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

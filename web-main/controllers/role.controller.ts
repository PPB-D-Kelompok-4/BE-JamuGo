import { Request, Response } from 'express';
import { RoleService } from '../../business-layer/services/role.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { RoleInputDTO } from '../../helpers/dtos/role.dto';

export class RoleController extends BaseController {
  private roleService: RoleService;

  constructor() {
    super();
    this.roleService = new RoleService();
  }

  public async findAllRoles(req: Request, res: Response): Promise<Response> {
    try {
      const roles = await this.roleService.findAllRoles(req);
      if (roles && roles.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          roles,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNoDataFoundSuccess(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findRoleByID(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const role = await this.roleService.findRoleByID(req, pkid);
      if (role) {
        return this.sendSuccessGet(
          req,
          res,
          role,
          MessagesKey.SUCCESSGETBYID,
          200,
          true,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async findRoleByName(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.params.name;
      const roles = await this.roleService.findByNameRole(req, name);
      if (roles && roles.length > 0) {
        return this.sendSuccessGet(
          req,
          res,
          roles,
          MessagesKey.SUCCESSGET,
          200,
        );
      } else {
        return this.sendErrorNotFound(req, res);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async createRole(req: Request, res: Response): Promise<Response> {
    try {
      const vm: RoleInputDTO = req.body;
      const result = await this.roleService.createRole(req, vm);
      return this.sendSuccessCreate(
        req,
        res,
        result,
        (result as any).pkid,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateRole(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const updateResult = await this.roleService.updateRole(
        req,
        pkid,
        req.body,
      );
      return this.sendSuccessUpdate(req, res, updateResult);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async softDeleteRole(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.roleService.softDeleteRole(req, pkid);
      return this.sendSuccessSoftDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async hardDeleteRole(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.roleService.hardDeleteRole(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async restoreRole(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.roleService.restoreRole(req, pkid);
      return this.sendSuccessRestore(req, res, pkid);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

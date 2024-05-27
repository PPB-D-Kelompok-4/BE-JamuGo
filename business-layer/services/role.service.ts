import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { RoleAttributes } from '../../infrastructure/models/role.model';
import { Model } from 'sequelize';
import { RoleInputDTO, RoleResultDTO, RoleUpdateDTO } from '../../helpers/dtos/role.dto';
import { RoleInputVM, RoleUpdateVM } from '../../helpers/view-models/role.vm';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class RoleService extends BaseService<Model<RoleAttributes>> {
  constructor() {
    super(new RoleRepository());
  }

  //region Find methods
  async findAllRoles(req: Request): Promise<Model<RoleAttributes>[]> {
    return await super.findAll(req);
  }

  async findRoleByID(
    req: Request,
    pkid: number,
  ): Promise<Model<RoleAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findByNameRole(
    req: Request,
    name: string,
  ): Promise<Model<RoleAttributes>[]> {
    return await super.where(req, { name });
  }
  //endregion

  //region Create methods
  async createRole(
    req: Request,
    role: RoleInputDTO,
  ): Promise<Model<RoleAttributes> | string> {
    const roleVM = new RoleInputVM(role);
    return await super.create(req, roleVM.roleData as RoleAttributes);
  }
  //endregion

  //region Update methods
  async updateRole(
    req: Request,
    pkid: number,
    role: RoleUpdateDTO,
  ): Promise<RoleResultDTO> {
    const roleVM = new RoleUpdateVM(role);
    await super.update(req, pkid, roleVM.roleData);
    const updatedRole = await this.findRoleByID(req, pkid);
    if (!updatedRole) {
      throw new Error(getMessage(req, MessagesKey.USERUPDATENOTFOUND));
    }
    return updatedRole.toJSON() as RoleResultDTO;
  }
  //endregion

  //region Delete methods
  async softDeleteRole(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteRole(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreRole(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion
}

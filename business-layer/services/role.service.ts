import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { RoleAttributes } from '../../infrastructure/models/role.model';
import { Model } from 'sequelize';
import { RoleInputVM, RoleResultVM } from '../../helpers/view-models/role.vm';
import { RoleResultDTO } from '../../helpers/dtos/role.dto';

export class RoleService extends BaseService<Model<RoleAttributes>> {
  constructor() {
    super(new RoleRepository());
  }

  //region Utility methods
  private convertToResultDTO(model: Model<RoleAttributes>): RoleResultDTO {
    return model.toJSON();
  }
  //endregion

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

  async findRoleByName(
    req: Request,
    name: string,
  ): Promise<Model<RoleAttributes>[]> {
    return await this.where(req, { name });
  }

  async roleExists(
    req: Request,
    criteria: Partial<RoleAttributes>,
  ): Promise<boolean> {
    return await this.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async createRole(req: Request, vm: RoleInputVM): Promise<RoleResultVM> {
    const roleAttributes: Partial<RoleAttributes> = { ...vm.roleData };
    const createdModel = await super.create(
      req,
      roleAttributes as RoleAttributes,
    );

    if (!(createdModel instanceof Model)) {
      throw new Error('Failed to create role');
    }

    const resultDTO = this.convertToResultDTO(createdModel);
    return new RoleResultVM(resultDTO);
  }

  //endregion

  //region Update methods
  async updateRole(
    req: Request,
    pkid: number,
    entity: Partial<RoleAttributes>,
  ): Promise<[number, Model<RoleAttributes>[]]> {
    return await super.update(req, pkid, entity);
  }
  //endregion

  //region Delete and Restore methods
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

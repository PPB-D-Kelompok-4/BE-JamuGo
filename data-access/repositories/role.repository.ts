import { Request } from 'express';
import { RoleAttributes } from '../../infrastructure/models/role.model';
import { Model, WhereOptions, CreationAttributes } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class RoleRepository extends BaseRepository<Model<RoleAttributes>> {
  constructor() {
    super(db.Role);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<RoleAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<RoleAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<RoleAttributes>,
  ): Promise<Model<RoleAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<RoleAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<RoleAttributes>>,
  ): Promise<Model<RoleAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<RoleAttributes>>[],
  ): Promise<Model<RoleAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<RoleAttributes>,
  ): Promise<[number, Model<RoleAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<RoleAttributes> }[],
  ): Promise<void> {
    return super.bulkUpdate(req, entities);
  }
  //endregion

  //region Delete methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return super.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}

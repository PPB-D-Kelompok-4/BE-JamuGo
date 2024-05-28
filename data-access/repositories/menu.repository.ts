import { Request } from 'express';
import { MenuAttributes } from '../../infrastructure/models/menu.model';
import { Model, WhereOptions, CreationAttributes } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class MenuRepository extends BaseRepository<Model<MenuAttributes>> {
  constructor() {
    super(db.Menu);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<MenuAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<MenuAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<MenuAttributes>,
  ): Promise<Model<MenuAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<MenuAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<MenuAttributes>>,
  ): Promise<Model<MenuAttributes>> {
    return await this.model.create(entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<MenuAttributes>>[],
  ): Promise<Model<MenuAttributes>[]> {
    return await this.model.bulkCreate(entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<MenuAttributes>,
  ): Promise<[number, Model<MenuAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<MenuAttributes> }[],
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

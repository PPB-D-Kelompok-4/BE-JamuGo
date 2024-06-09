import { Request } from 'express';
import { TransactionAttributes } from '../../infrastructure/models/transaction.model';
import { Model, WhereOptions, CreationAttributes, FindOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class TransactionRepository extends BaseRepository<
  Model<TransactionAttributes>
> {
  constructor() {
    super(db.Transaction);
  }

  //region Find methods
  async findAll(
    req: Request,
    options?: FindOptions<TransactionAttributes>,
  ): Promise<Model<TransactionAttributes>[]> {
    return await super.findAll(req, options);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<TransactionAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<TransactionAttributes>,
  ): Promise<Model<TransactionAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<TransactionAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<TransactionAttributes>>,
  ): Promise<Model<TransactionAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<TransactionAttributes>>[],
  ): Promise<Model<TransactionAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<TransactionAttributes>,
  ): Promise<[number, Model<TransactionAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<TransactionAttributes> }[],
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

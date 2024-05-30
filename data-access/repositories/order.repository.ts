import { Request } from 'express';
import { OrderAttributes } from '../../infrastructure/models/order.model';
import { Model, WhereOptions, CreationAttributes, FindOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { getMessage } from '../../helpers/messages/messagesUtil';

export class OrderRepository extends BaseRepository<Model<OrderAttributes>> {
  constructor() {
    super(db.Order);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<OrderAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(req: Request, pkid: number): Promise<Model<OrderAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(req: Request, criteria: WhereOptions<OrderAttributes>, options?: FindOptions): Promise<Model<OrderAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(req: Request, criteria: Partial<OrderAttributes>): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }

  async findOne(req: Request, options: FindOptions<OrderAttributes>): Promise<Model<OrderAttributes> | null> {
    try {
      return await this.model.findOne(options);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(getMessage(req, MessagesKey.ERRORFINDINGALL) + ': ' + error.message);
      }
      throw error;
    }
  }
  //endregion

  //region Create methods
  async create(req: Request, entity: CreationAttributes<Model<OrderAttributes>>): Promise<Model<OrderAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(req: Request, entities: CreationAttributes<Model<OrderAttributes>>[]): Promise<Model<OrderAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(req: Request, pkid: number, entity: Partial<OrderAttributes>): Promise<[number, Model<OrderAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(req: Request, entities: { pkid: number; values: Partial<OrderAttributes> }[]): Promise<void> {
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

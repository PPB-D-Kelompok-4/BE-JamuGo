import { Request } from 'express';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model, WhereOptions, CreationAttributes } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class UserRepository extends BaseRepository<Model<UserAttributes>> {
  constructor() {
    super(db.User);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<UserAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<UserAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<UserAttributes>,
  ): Promise<Model<UserAttributes>[]> {
    return super.where(req, criteria);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<UserAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }

  async findByUUID(uuid: string): Promise<Model<UserAttributes> | null> {
    return await this.model.findOne({ where: { uuid } });
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<UserAttributes>>,
  ): Promise<Model<UserAttributes>> {
    return await this.model.create(entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<UserAttributes>>[],
  ): Promise<Model<UserAttributes>[]> {
    return await this.model.bulkCreate(entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<UserAttributes>,
  ): Promise<[number, Model<UserAttributes>[]]> {
    return await this.model.update(entity, {
      where: { pkid },
      returning: true,
    });
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<UserAttributes> }[],
  ): Promise<void> {
    for (const entity of entities) {
      await this.update(req, entity.pkid, entity.values);
    }
  }
  //endregion

  //region Delete methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    await this.model.destroy({ where: { pkid } });
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}

import { Request } from 'express';
import { MenuRepository } from '../../data-access/repositories/menu.repository';
import { MenuAttributes } from '../../infrastructure/models/menu.model';
import { BaseService } from '../common/base.service';
import { MenuInputDTO, MenuResultDTO, MenuUpdateDTO } from '../../helpers/dtos/menu.dto';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { checkAdminRole } from '../../helpers/utility/checkAdminRole';
import { Model } from 'sequelize';
import { MenuInputVM } from '../../helpers/view-models/menu.vm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

export class MenuService extends BaseService<Model<MenuAttributes>> {
  private menuRepository: MenuRepository;

  constructor() {
    super(new MenuRepository());
    this.menuRepository = new MenuRepository();
  }

  async createMenu(
    req: Request,
    menu: MenuInputDTO,
  ): Promise<MenuResultDTO> {
    await checkAdminRole(req);
    const menuVM = new MenuInputVM(menu);
    const createdMenu = await this.menuRepository.create(req, menuVM.menuData as MenuAttributes);
    const result = createdMenu.toJSON() as MenuResultDTO;
    if (result.image_url) {
      result.image_url = `${BASE_URL}/assets/image-menus/${path.basename(result.image_url)}`;
    }
    return result;
  }

  public async getMenuById(req: Request, pkid: number): Promise<MenuResultDTO> {
    const menu = await this.menuRepository.findByID(req, pkid);
    if (!menu) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    const result = menu.toJSON() as MenuResultDTO;
    if (result.image_url) {
      result.image_url = `${BASE_URL}/assets/image-menus/${path.basename(result.image_url)}`;
    }
    return result;
  }

  public async getAllMenus(req: Request): Promise<MenuResultDTO[]> {
    const menus = await this.menuRepository.findAll(req);
    return menus.map(menu => {
      const result = menu.toJSON() as MenuResultDTO;
      if (result.image_url) {
        result.image_url = `${BASE_URL}/assets/image-menus/${path.basename(result.image_url)}`;
      }
      return result;
    });
  }

  public async updateMenu(req: Request, pkid: number, data: MenuUpdateDTO): Promise<MenuResultDTO> {
    await checkAdminRole(req);
    const [numberOfAffectedRows] = await this.menuRepository.update(req, pkid, data);
    if (numberOfAffectedRows === 0) {
      throw new Error(getMessage(req, MessagesKey.USERUPDATENOTFOUND));
    }
    const updatedMenu = await this.menuRepository.findByID(req, pkid);
    if (!updatedMenu) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    const result = updatedMenu.toJSON() as MenuResultDTO;
    if (result.image_url) {
      result.image_url = `${BASE_URL}/assets/image-menus/${path.basename(result.image_url)}`;
    }
    return result;
  }

  public async deleteMenu(req: Request, pkid: number): Promise<void> {
    await checkAdminRole(req);
    await this.menuRepository.hardDelete(req, pkid);
  }
}

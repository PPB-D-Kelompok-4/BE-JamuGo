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
    return createdMenu.toJSON() as MenuResultDTO;
  }

  public async getMenuById(req: Request, pkid: number): Promise<MenuResultDTO> {
    const menu = await this.menuRepository.findByID(req, pkid);
    if (!menu) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    return menu.toJSON() as MenuResultDTO;
  }

  public async getAllMenus(req: Request): Promise<MenuResultDTO[]> {
    const menus = await this.menuRepository.findAll(req);
    return menus.map(menu => menu.toJSON() as MenuResultDTO);
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
    return updatedMenu.toJSON() as MenuResultDTO;
  }

  public async deleteMenu(req: Request, pkid: number): Promise<void> {
    await checkAdminRole(req);
    await this.menuRepository.hardDelete(req, pkid);
  }
}

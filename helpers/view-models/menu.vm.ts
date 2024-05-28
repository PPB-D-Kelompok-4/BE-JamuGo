import { MenuInputDTO, MenuUpdateDTO, MenuResultDTO } from '../dtos/menu.dto';

export class MenuInputVM {
  menuData: MenuInputDTO;

  constructor(menuData: MenuInputDTO) {
    this.menuData = menuData;
  }
}

export class MenuUpdateVM {
  menuData: MenuUpdateDTO;

  constructor(menuData: MenuUpdateDTO) {
    this.menuData = menuData;
  }
}

export class MenuResultVM {
  result: MenuResultDTO;

  constructor(result: MenuResultDTO) {
    this.result = result;
  }
}

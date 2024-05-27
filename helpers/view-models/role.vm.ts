import { RoleInputDTO, RoleResultDTO, RoleUpdateDTO } from '../dtos/role.dto';

export class RoleInputVM {
  roleData: RoleInputDTO;

  constructor(roleData: RoleInputDTO) {
    this.roleData = roleData;
  }
}

export class RoleUpdateVM {
  roleData: RoleUpdateDTO;

  constructor(roleData: RoleUpdateDTO) {
    this.roleData = roleData;
  }
}

export class RoleResultVM {
  result: RoleResultDTO;

  constructor(result: RoleResultDTO) {
    this.result = result;
  }
}

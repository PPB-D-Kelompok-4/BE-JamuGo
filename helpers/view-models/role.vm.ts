import { RoleInputDTO, RoleResultDTO } from '../dtos/role.dto';

export class RoleInputVM {
  roleData: RoleInputDTO;

  constructor(roleData: RoleInputDTO) {
    this.roleData = roleData;
  }
}

export class RoleResultVM {
  result: RoleResultDTO;

  constructor(result: RoleResultDTO) {
    this.result = result;
  }
}

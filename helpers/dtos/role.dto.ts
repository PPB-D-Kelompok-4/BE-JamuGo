import { RoleAttributes } from '../../infrastructure/models/role.model';

export interface RoleInputDTO {
  name: string;
}

export interface RoleResultDTO extends RoleAttributes {}

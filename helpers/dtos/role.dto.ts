import { RoleAttributes } from '../../infrastructure/models/role.model';

export interface RoleInputDTO {
  name: string;
}

export interface RoleUpdateDTO {
  name?: string;
  description?: string;
}

export interface RoleResultDTO extends RoleAttributes {}

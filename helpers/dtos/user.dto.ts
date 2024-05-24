import { UserAttributes } from '../../infrastructure/models/user.model';

export interface UserInputDTO {
  email: string;
  password: string;
  name: string;
  address?: string;
}

export interface UserUpdateDTO {
  name?: string;
  address?: string;
  image_profile?: string | null;
}

export interface UserResultDTO extends UserAttributes {}

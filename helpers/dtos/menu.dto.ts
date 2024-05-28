export interface MenuInputDTO {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface MenuUpdateDTO {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
}

export interface MenuResultDTO {
  pkid: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

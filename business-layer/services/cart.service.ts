import { Request } from 'express';
import { CartRepository } from '../../data-access/repositories/cart.repository';
import { CartItemRepository } from '../../data-access/repositories/cartItem.repository';
import { MenuRepository } from '../../data-access/repositories/menu.repository';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { CartAttributes } from '../../infrastructure/models/cart.model';
import { BaseService } from '../common/base.service';
import { CartUpdateDTO, CartResultDTO, CartItemInputDTO, CartItemUpdateDTO, CartItemResultDTO } from '../../helpers/dtos/cart.dto';
import { CartUpdateVM, CartItemInputVM, CartItemUpdateVM } from '../../helpers/view-models/cart.vm';
import { Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { CartItemAttributes } from '../../infrastructure/models/cartItem.model';

interface CartResultWithItemsDTO extends CartResultDTO {
  items: CartItemResultDTO[];
}

export class CartService extends BaseService<Model<CartAttributes>> {
  private cartRepository: CartRepository;
  private cartItemRepository: CartItemRepository;
  private menuRepository: MenuRepository;
  private userRepository: UserRepository;

  constructor() {
    super(new CartRepository());
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.menuRepository = new MenuRepository();
    this.userRepository = new UserRepository();
  }

  public async getCartByUser(req: Request): Promise<CartResultWithItemsDTO> {
    const user = (req as any).user;
    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const cart = await this.cartRepository.where(req, { user_pkid: dbUser.getDataValue('pkid') });
    if (cart.length === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const cartItems = await this.cartItemRepository.where(req, { cart_pkid: cart[0].getDataValue('pkid') });
    const cartResult = cart[0].toJSON() as CartResultWithItemsDTO;
    cartResult.items = cartItems.map(item => item.toJSON() as CartItemResultDTO);

    return cartResult;
  }

  public async updateCart(req: Request, pkid: number, data: CartUpdateDTO): Promise<CartResultDTO> {
    const cartVM = new CartUpdateVM(data);
    const [numberOfAffectedRows] = await this.cartRepository.update(req, pkid, cartVM.cartData as Partial<CartAttributes>);
    if (numberOfAffectedRows === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    const updatedCart = await this.cartRepository.findByID(req, pkid);
    if (!updatedCart) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    return updatedCart.toJSON() as CartResultDTO;
  }

  public async addItemToCart(req: Request, cartItem: CartItemInputDTO): Promise<CartItemResultDTO | null> {
    const user = (req as any).user;
    const dbUser = await this.userRepository.findByUUID(user.uid);
    if (!dbUser) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const cart = await this.cartRepository.where(req, { user_pkid: dbUser.getDataValue('pkid') });
    if (cart.length === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }

    const existingCartItem = await this.cartItemRepository.where(req, { cart_pkid: cart[0].getDataValue('pkid'), menu_pkid: cartItem.menu_pkid });

    let createdOrUpdatedCartItem: Model<CartItemAttributes> | null = null;
    if (existingCartItem.length > 0) {
      const menu = await this.menuRepository.findByID(req, cartItem.menu_pkid);
      if (!menu) {
        throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
      }
      const price = menu.getDataValue('price');
      const updatedPrice = price * cartItem.quantity;

      if (cartItem.quantity === 0) {
        await this.cartItemRepository.hardDelete(req, existingCartItem[0].getDataValue('pkid'));
      } else {
        const [updateCount, updatedItems] = await this.cartItemRepository.update(req, existingCartItem[0].getDataValue('pkid'), { quantity: cartItem.quantity, price: updatedPrice });
        if (updateCount > 0 && updatedItems.length > 0) {
          createdOrUpdatedCartItem = updatedItems[0];
        }
      }
    } else {
      if (cartItem.quantity > 0) {
        const menu = await this.menuRepository.findByID(req, cartItem.menu_pkid);
        if (!menu) {
          throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
        }
        const price = menu.getDataValue('price');
        const cartItemData = {
          cart_pkid: cart[0].getDataValue('pkid'),
          menu_pkid: cartItem.menu_pkid,
          quantity: cartItem.quantity,
          price: price * cartItem.quantity,
        };

        const cartItemVM = new CartItemInputVM(cartItemData);
        const result = await this.cartItemRepository.create(req, cartItemVM.cartItemData as CartItemAttributes);
        if (result instanceof Model) {
          createdOrUpdatedCartItem = result;
        } else {
          throw new Error(getMessage(req, MessagesKey.ERRORCREATION));
        }
      }
    }

    await this.updateTotalPrice(req, cart[0].getDataValue('pkid'));
    return createdOrUpdatedCartItem ? createdOrUpdatedCartItem.toJSON() as CartItemResultDTO : null;
  }

  private async updateTotalPrice(req: Request, cartPkid: number): Promise<void> {
    const cartItems = await this.cartItemRepository.where(req, { cart_pkid: cartPkid });
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(String(item.getDataValue('price'))), 0);
    await this.cartRepository.update(req, cartPkid, { total_price: totalPrice });
  }

  public async updateCartItem(req: Request, pkid: number, data: CartItemUpdateDTO): Promise<CartItemResultDTO> {
    const cartItemVM = new CartItemUpdateVM(data);
    const [numberOfAffectedRows] = await this.cartItemRepository.update(req, pkid, cartItemVM.cartItemData as Partial<CartItemAttributes>);
    if (numberOfAffectedRows === 0) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    const updatedCartItem = await this.cartItemRepository.findByID(req, pkid);
    if (!updatedCartItem) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    await this.updateTotalPrice(req, updatedCartItem.getDataValue('cart_pkid'));
    return updatedCartItem.toJSON() as CartItemResultDTO;
  }

  public async deleteCartItem(req: Request, pkid: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findByID(req, pkid);
    if (!cartItem) {
      throw new Error(getMessage(req, MessagesKey.NODATAFOUND));
    }
    const cartPkid = cartItem.getDataValue('cart_pkid');
    await this.cartItemRepository.hardDelete(req, pkid);
    await this.updateTotalPrice(req, cartPkid);
  }

  public async getCartItems(req: Request, cart_pkid: number): Promise<CartItemResultDTO[]> {
    const cartItems = await this.cartItemRepository.where(req, { cart_pkid });
    return cartItems.map(item => item.toJSON() as CartItemResultDTO);
  }
}

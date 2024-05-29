import { Request, Response } from 'express';
import { CartService } from '../../business-layer/services/cart.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { CartUpdateDTO, CartItemInputDTO, CartItemUpdateDTO } from '../../helpers/dtos/cart.dto';
import { CartUpdateVM, CartResultVM, CartItemInputVM, CartItemUpdateVM, CartItemResultVM } from '../../helpers/view-models/cart.vm';

export class CartController extends BaseController {
  private cartService: CartService;

  constructor() {
    super();
    this.cartService = new CartService();
  }

  public async getCartByUser(req: Request, res: Response): Promise<Response> {
    try {
      const cart = await this.cartService.getCartByUser(req);
      const cartResultVM = new CartResultVM(cart);
      return this.sendSuccessGet(req, res, cartResultVM.result, MessagesKey.SUCCESSGETBYID);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const cartUpdate = new CartUpdateVM(req.body as CartUpdateDTO);
      const cart = await this.cartService.updateCart(req, pkid, cartUpdate.cartData);
      const cartResultVM = new CartResultVM(cart);
      return this.sendSuccessUpdate(req, res, cartResultVM.result);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async addItem(req: Request, res: Response): Promise<Response> {
    try {
      const cartItemInput = new CartItemInputVM(req.body as CartItemInputDTO);
      const cartItem = await this.cartService.addItemToCart(req, cartItemInput.cartItemData);

      if (cartItem) {
        const cartItemResultVM = new CartItemResultVM(cartItem);
        return this.sendSuccessCreate(req, res, cartItemResultVM.result, cartItem.pkid);
      } else {
        return this.sendSuccessCreate(req, res, {}, MessagesKey.ERRORHARDDELETING);
      }
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async updateItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const cartItemUpdate = new CartItemUpdateVM(req.body as CartItemUpdateDTO);
      const cartItem = await this.cartService.updateCartItem(req, pkid, cartItemUpdate.cartItemData);
      const cartItemResultVM = new CartItemResultVM(cartItem);
      return this.sendSuccessUpdate(req, res, cartItemResultVM.result);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async deleteItem(req: Request, res: Response): Promise<Response> {
    try {
      const pkid = parseInt(req.params.pkid);
      if (isNaN(pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      await this.cartService.deleteCartItem(req, pkid);
      return this.sendSuccessHardDelete(req, res);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getCartItems(req: Request, res: Response): Promise<Response> {
    try {
      const cart_pkid = parseInt(req.params.cart_pkid);
      if (isNaN(cart_pkid)) {
        return this.sendErrorBadRequest(req, res);
      }
      const cartItems = await this.cartService.getCartItems(req, cart_pkid);
      const cartItemResultVMs = cartItems.map(item => new CartItemResultVM(item));
      return this.sendSuccessGet(req, res, cartItemResultVMs.map(vm => vm.result), MessagesKey.SUCCESSGET);
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}

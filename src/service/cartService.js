import { Cart } from '../models/cart.js';

export const saveCart = async (userId, items) => {
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      existingCart.items = items;
      existingCart.updatedAt = Date.now();
      return await existingCart.save();
    } else {
      const cart = new Cart({ userId, items });
      return await cart.save();
    }
  };
  
  export const getCartByUser = async (userId) => {
    return await Cart.findOne({ userId });
  };
  
  export const clearCart = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
  };
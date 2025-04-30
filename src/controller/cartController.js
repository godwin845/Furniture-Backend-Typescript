import * as cartService from '../service/cartService.js';

export const saveCart = async (req, res) => {
    const { userId, items } = req.body;
    if (!userId || !Array.isArray(items)) {
      return res.status(400).json({ error: 'userId and items are required' });
    }
   
    try {
      const result = await cartService.saveCart(userId, items);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save cart' });
    }
  };
  
  export const getCart = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await cartService.getCartByUser(userId);
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  };
  
  export const clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
      await cartService.clearCart(userId);
      res.status(200).json({ message: 'Cart cleared' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
import * as CheckoutService from '../service/checkoutService.js';

export const createOrder = async (req, res) => {
    try {
      const newOrder = await CheckoutService.createOrder(req.body);
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  };
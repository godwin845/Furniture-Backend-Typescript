import { Checkout } from '../models/checkout.js';

export const createOrder = async (orderData) => {
    const order = new Checkout(orderData);
    return await order.save();
  };
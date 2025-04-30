import { Order } from '../models/order.js';

export const getAllOrders = async () => {
    return await Order.find();
};

export const deleteOrder = async (orderId) => {
    return await Order.findByIdAndDelete({ orderId });
};
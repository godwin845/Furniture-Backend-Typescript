import { getAllOrders, deleteOrder } from '../service/orderService.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders!' });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await deleteOrder(orderId);
    if (!result) {
      return res.status(404).json({ error: 'Order not found!' });
    }
    res.status(200).json({ error: 'Order cancelled successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order!' });
  }
};
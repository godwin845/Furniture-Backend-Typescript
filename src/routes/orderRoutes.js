import { Router } from "express";
import * as orderController from '../controller/orderController.js';

const router = Router();

router.get('/', orderController.getOrders);
router.delete('/:orderId', orderController.cancelOrder);

export default router;
import { Router } from "express";
import * as cartController from '../controller/cartController.js';

const router = Router();

router.post('/', cartController.saveCart);
router.get('/:userId', cartController.getCart);
router.delete('/:userId', cartController.clearCart);

export default router;
import { Router } from "express";
import * as CheckoutController from '../controller/checkoutController.js';

const router = Router();

router.post('/', CheckoutController.createOrder);

export default router;
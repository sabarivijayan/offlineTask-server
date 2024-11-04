import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { checkout } from '../controllers/checkout-controller.js'

const checkoutRouter = express.Router();

checkoutRouter.post("/checkout", authMiddleware, checkout);

export default checkoutRouter;
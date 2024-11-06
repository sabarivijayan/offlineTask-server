import express from 'express';
import { addToCart, calculateDiscountedTotal, getCart, removeFromCart } from '../controllers/cart-controller.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/get",authMiddleware,getCart);
cartRouter.post("/add",authMiddleware,addToCart);
cartRouter.post("/remove",authMiddleware,removeFromCart);
cartRouter.post("/discounted-total", authMiddleware, calculateDiscountedTotal);

export default cartRouter;
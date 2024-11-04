import express from 'express'
import { listOrders, placeOrder, userOrders } from '../controllers/order-controller.js'
import authMiddleware from '../middleware/auth.js'


const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);

export default orderRouter;
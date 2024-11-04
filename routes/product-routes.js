import express from 'express'
import { listProducts } from '../controllers/product-controller.js'

const productRouter = express.Router()

productRouter.get('/list', listProducts);

export default productRouter;
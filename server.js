import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import userRouter from './routes/user-routes.js'
import cartRouter from './routes/cart-routes.js'
import { seedProducts } from './data-seeder.js'
import productRouter from './routes/product-routes.js'
import checkoutRouter from './routes/checkout-routes.js'
import orderRouter from './routes/order-routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors({ origin: true, credentials: true })); 

connectDB()

app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/product", productRouter);
app.use("/api/checkout", checkoutRouter);
app.use('/api/orders', orderRouter)
app.get("/", (req,res) =>{
    res.send("API Working");
});

app.listen(port, () =>{
    console.log(`Server started on http:localhost:${port}`)
});


// seedProducts();
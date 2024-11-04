import orderModel from "../models/order-model.js";
import userModel from "../models/user-model.js";
import { applyDiscounts } from "./discount-controller.js";

export const checkout = async (req,res) =>{
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).populate('cartData');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const total = await applyDiscounts(user.cartData, user);

        const order = new orderModel({
            userId,
            items: Object.entries(user.carData).map(([itemId, quantity]) => ({
                product: itemId,
                quantity,
                price: total/quantity,
            })),
            amount: total,
        });
        await order.save();

        user.purchaseCount += 1;
        user.lifetimeSpend += total;
        await user.save();

        user.cartData = {}
        await user.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error during checkout" });
    }
}
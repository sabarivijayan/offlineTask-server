import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items:{type:Array, required:true},
    amount:{type:Number, required:true},
    address: {type:Object, required:true},
    status:{type:String, default:"booked"},
    date:{type:Date, default:Date.now()},
})

const orderModel = mongoose.models.order || mongoose.model("Order", orderSchema);
export default orderModel;
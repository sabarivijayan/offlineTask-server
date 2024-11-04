import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    suk: {type: String, required: true, unique: true},
    name: {type: String, required:true},
    price: {type: Number, required:true},
    description:{type: String},
    image:{type: String, required:true},
    discounts:{type: Map, of: mongoose.Schema.Types.Mixed},
})

const productModel = mongoose.models.product || mongoose.model("Product", productSchema);
export default productModel;
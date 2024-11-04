import mongoose, { Mongoose } from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email: { type:String, required: true, unique:true},
    password: { type:String, required:true},
    purchasesCount:{type: Number, default: 0},
    lifetimeSpend: {type: Number, default: 0},
    referredBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    anniversary:{type: Date },
    discountEligible: {type: Boolean, default: false},
    cartData:{type:Object, default:{}}
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model("User", userSchema);
export default userModel;
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

export const  connectDB = async () =>{
    await mongoose.connect(`mongodb+srv://mekryptic:${process.env.MONGODB_PASS}@cluster0.ky1ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(()=>console.log("DB Connected"));
}

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/user-model.js'

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}

const loginUser = async (req,res) =>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({success:false, message: 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({success:false, message: 'Invalid credentials'});
        }
        const token = createToken(user._id)
        res.status(200).json({success:true, token})
    }catch(error){
        console.log(error);
        res.status(401).json({success:false, message: "Error"})
    }
}

const registerUser = async (req,res) =>{
    const {name, email, password} = req.body;
}
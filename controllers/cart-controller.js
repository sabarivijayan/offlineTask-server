import userModel from "../models/user-model.js";


//Adds the product to the cart according to its product id which is the itemId  and for the specific user
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.body.userId });
    let cartData = await userData.cartData;
    
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    
    res.status(201).json({ success: true, message: "Added to Cart" });

  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Error" });
  }
};


//Removes the product from the cart according to its product id which is the itemId and for the specific user
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


//Gets the products in the cart according to the specific user
const getCart = async (req, res) => {
    try {
       let userData = await userModel.findById(req.body.userId);
       let cartData = await userData.cartData;
       res.json({ success: true, cartData:cartData });
    } catch (error) {
       console.log(error);
       res.json({ success: false, message: "Error" })
    }
 }
 
 
 export { addToCart, removeFromCart, getCart }
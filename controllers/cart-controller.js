import productModel from "../models/product-model.js";
import userModel from "../models/user-model.js";
import { applyDiscounts } from "./discount-controller.js";

// Adds the product to the cart according to itemId for the specific user
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    let cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.status(201).json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Error adding to cart" });
  }
};

// Removes the product from the cart according to itemId for the specific user
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    let cartData = userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// Gets the products in the cart for the specific user
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    const cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};


const calculateDiscountedTotal = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      console.error(`User with ID ${req.userId} not found.`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData;
    const filteredCartData = {};
    for (const itemId in cartData) {
      if (cartData[itemId] > 0) {
        filteredCartData[itemId] = cartData[itemId];
      }
    }

    const populatedCartData = {};
    console.log("populatedCartData",populatedCartData)
    let originalTotal = 0;

    for (const itemId of Object.keys(filteredCartData)) {
      const product = await productModel.findById(itemId);
      if (product) {
        const quantity = filteredCartData[itemId];
        const price = product.price;
        originalTotal += price * quantity;
        populatedCartData[itemId] = {
          quantity,
          price,
          suk: product.suk,
        };
      } else {
        console.error(`Product with ID ${itemId} not found in database.`);
      }
    }

    const totalWithDiscounts = await applyDiscounts(populatedCartData, user);
    
    const discountAmount = originalTotal - totalWithDiscounts;
    
    res.status(200).json({
      success: true,
      total: originalTotal,
      discount: discountAmount,
      payable: totalWithDiscounts,
      discountNames: totalWithDiscounts.discounts
    });
  } catch (error) {
    console.error("Error in calculateDiscountedTotal:", error);
    res.status(500).json({ success: false, message: "Error calculating discounted total" });
  }
};




export { addToCart, removeFromCart, getCart, calculateDiscountedTotal };

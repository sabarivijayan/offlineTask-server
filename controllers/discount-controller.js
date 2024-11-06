
const calculatePercentageDiscount = (amount, percentage) => {
  return amount * (percentage / 100);
};

const applyDiscountCap = (originalPrice, totalDiscount, isBOGO) => {
  
  if (isBOGO) return totalDiscount;

  const maxDiscount = originalPrice ;
  return Math.min(totalDiscount, maxDiscount);
};

const isWithinDateRange = (start, end) => {
  const currentDate = new Date();
  return currentDate >= new Date(start) && currentDate <= new Date(end);
};

export const applyDiscounts = async (cartData, user) => {
  if (!cartData || Object.keys(cartData).length === 0) {
    return { total: 0, appliedDiscounts: [] };
  }

  let finalTotal = 0;
  const uniqueProducts = new Set();
  const appliedDiscounts = [];
  const sukMap = new Map(); //to store suk references
  
  // collect all SKUs
  for (const [itemId, details] of Object.entries(cartData)) {
    if (details?.suk) {
      uniqueProducts.add(details.suk);
      sukMap.set(itemId, details.suk);
    }
  }

  // calculate individual item discounts
  for (const [itemId, details] of Object.entries(cartData)) {
    if (!details || details.quantity <= 0) continue;

    const { price, quantity, suk } = details;
    const originalTotal = price * quantity;
    let itemDiscounts = [];
    let isBOGO = false;
    // apply individual item discounts
    switch (suk) {
      case 'PF1': // buy-one-get-one-free
        const freeItems = Math.floor(quantity / 2);
        itemDiscounts.push(freeItems * price);
        isBOGO = true;
        appliedDiscounts.push("Buy 1 Get 1 Free");
        break;

      case 'PF2': 
        if (quantity >= 3) {
          itemDiscounts.push((price - 75) * quantity);
          appliedDiscounts.push("Buy 3 or More & Pay Just $75 Each!");
        }
        break;

        case "PF3": 
        if (uniqueProducts.has("PF1")) {
          itemDiscounts.push(10);
          appliedDiscounts.push("Special Combo: $10 Off on Calvin Klein"); 
        }
        break;
      

      case 'PF4': // seasonal Discount
        if (isWithinDateRange('2024-12-01', '2024-12-31')) {
          itemDiscounts.push(calculatePercentageDiscount(originalTotal, 15));
          appliedDiscounts.push("Limited Time Only: 15% Off");
        }
        break;

      case 'PF5': // tiered Discount
        if (quantity >= 4) {
          itemDiscounts.push(calculatePercentageDiscount(originalTotal, 20));
          appliedDiscounts.push("Buy 4+ Units for 20% Off");
        } else if (quantity >= 2) {
          itemDiscounts.push(calculatePercentageDiscount(originalTotal, 10));
          appliedDiscounts.push("Buy 2 Units for 10% Off");
        }
        break;

      case 'PF6': // bundle Discount
        if (uniqueProducts.has('PF4')) {
          itemDiscounts.push(calculatePercentageDiscount(originalTotal, 25));
          appliedDiscounts.push("Bundle Discount: 25% Off");
        }
        break;
    }

    // apply discount cap and add to final total
    const totalItemDiscount = applyDiscountCap(
      originalTotal,
      itemDiscounts.reduce((sum, discount) => sum + discount, 0),
      isBOGO
    );
    
    finalTotal += originalTotal - totalItemDiscount;
  }

  // apply cart-wide discounts
  if (uniqueProducts.size >= 6) {
    finalTotal *= 0.85;
    appliedDiscounts.push("Cart-Wide Discount: 15% Off for 6+ Unique Items");
  } else if (uniqueProducts.size >= 5) {
    finalTotal *= 0.9;
    appliedDiscounts.push("Cart-Wide Discount: 10% Off for 5+ Unique Items");
  }

  // cart total threshold discount
  if (finalTotal > 500) {
    finalTotal *= 0.95;
    appliedDiscounts.push("Order Total Discount: 5% Off for Orders Above $500");
  }

  // user-specific discounts
  if (user) {
    // loyalty discount
    if (user.purchasesCount >= 5) {
      finalTotal *= 0.95;
      appliedDiscounts.push("Loyalty Discount: 5% Off");
      // extra discount for loyal customers with large orders > 500
      if (finalTotal > 500) {
        finalTotal *= 0.98;
        appliedDiscounts.push("Extra 2% Off for Loyal Customers with Orders Above $500");
      }
    }

    // Anniversary discount
    const anniversaryDate = new Date(user.anniversary)?.setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    if (anniversaryDate && anniversaryDate === today) {
      finalTotal *= 0.8;
      appliedDiscounts.push("Anniversary Discount: 20% Off");
    }

    // Referral program discount
    if (user.referredBy) {
      finalTotal *= 0.9;
      appliedDiscounts.push("Referral Discount: 10% Off");
    }

    // VIP tier discount
    if (user.lifetimeSpend > 5000) {
      finalTotal *= 0.9;
      appliedDiscounts.push("VIP Tier Discount: 10% Off for Lifetime Spend Over $5000");
    }
  }
  console.log("disc",appliedDiscounts);
  return Math.round(finalTotal * 100) / 100;
};


export const calculateDiscountedTotal = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // get cart data and filter out items with quantity 0
    const cartItems = Object.entries(user.cartData || {})
      .filter(([_, quantity]) => quantity > 0);

    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        discount: 0,
        payable: 0
      });
    }

    // populate cart data with product details
    const populatedCartData = {};
    let originalTotal = 0;

    for (const [itemId, quantity] of cartItems) {
      const product = await productModel.findById(itemId).lean();
      if (!product) continue;

      originalTotal += product.price * quantity;
      populatedCartData[itemId] = {
        quantity,
        price: product.price,
        suk: product.suk,
      };
    }

    const totalWithDiscounts = await applyDiscounts(populatedCartData, user);
    
    
    return res.status(200).json({
      success: true,
      total: originalTotal,
      discount: originalTotal - totalWithDiscounts,
      payable: totalWithDiscounts,
      discountNames: totalWithDiscounts.appliedDiscounts
    });
    
  } catch (error) {
    console.error("Error calculating discounted total:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error calculating discounted total" 
    });
  }
};
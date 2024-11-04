import productModel from "../models/product-model.js";


export const applyDiscounts = async (cartData, user) => {
    let total = 0;
    let uniqueProducts = new Set(Object.keys(cartData));
  
    for (const [itemId, quantity] of Object.entries(cartData)) {
      const product = await productModel.findById(itemId);
      if(!product){
        continue;
      }

      let productTotal = product.price*quantity;
  
      switch (product.sku) {
        case 'PF1': // "Cool Water" - Buy-One-Get-One-Free
          productTotal -= Math.floor(item.quantity / 2) * product.price;
          break;
  
        case 'PF2': // "Lataffa" - Bulk Discount for 3 or more
          if (quantity >= 3) {
            productTotal = 75 * quantity;
          }
          break;
  
        case 'PF3': // "CK" - Combo Discount
          if (uniqueProducts.has('PF1')) {
            productTotal -= 10; // Combo discount with "Cool Water"
          }
          break;
  
        case 'PF4': // "Armani Code" - Limited Time Discount
          const discountStart = new Date('2023-12-01');
          const discountEnd = new Date('2023-12-31');
          const currentDate = new Date();
          if (currentDate >= discountStart && currentDate <= discountEnd) {
            productTotal *= 0.85;
          }
          break;
  
        case 'PF5': // "Gucci Bloom" - Tiered Discounts
          if (quantity >= 4) {
            productTotal *= 0.8;
          } else if (quantity >= 2) {
            productTotal *= 0.9;
          }
          break;
  
        case 'PF6': // "Chanel No. 5" - Seasonal Discount with "Armani Code"
          if (uniqueProducts.has('PF4')) {
            productTotal *= 0.75;
          }
          break;
  
        default:
          break;
      }
  
      // Apply item discount capping max 30% per item
      const originalTotal = product.price * quantity;
      if (productTotal < originalTotal * 0.7) {
        productTotal = originalTotal * 0.7;
      }
      total += productTotal;
    }
  
    // Cart-level Discounts
    if (uniqueProducts.size >= 5) {
      total *= 0.9;
    }
    if (uniqueProducts.size === 6) {
      total *= 0.85;
    }
  
    // Loyalty Program Discount
    if (user.purchasesCount >= 5) {
      total *= 0.95;
    }
  
    // Cart-Wide Discount for $500+ total
    if (total > 500) {
      total *= 0.95;
    }
  
    // Complex Loyalty Combo Discount
    if (user.purchasesCount >= 5 && total > 500) {
      total *= 0.98;
    }
  
    // Anniversary Discount
    const anniversaryDate = new Date(user.anniversary).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    if (anniversaryDate === today) {
      total *= 0.8;
    }
  
    // Apply Exclusive Tier benefits
    if (user.lifetimeSpend > 5000) {
      total *= 0.9;
    }
  
    // Return the final cart total after all discounts
    return total;
  };
  
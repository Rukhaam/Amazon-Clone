// src/utils/order.utils.js
import { db } from "../firebase/firebase.utils"; // Adjust path to your firebase config
import { doc, runTransaction } from "firebase/firestore";

export const processOrderInventory = async (cartItems) => {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Loop through all items in the cart
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Product ${item.title} does not exist!`);
        }

        const currentStock = productDoc.data().quantity || 0;
        console.log(currentStock);
        
        const newStock = currentStock - item.quantity;

        // 2. Check if we have enough stock
        if (newStock < 0) {
          throw new Error(`Sorry, ${item.title} is out of stock!`);
        }

        // 3. Update the stock
        transaction.update(productRef, { quantity: newStock });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Order failed: ", error);
    return { success: false, error: error.message };
  }
};
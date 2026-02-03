const Razorpay = require("razorpay");
require("dotenv").config({ path: "server/server.env" });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Testing keys...");
console.log("Key ID:", process.env.RAZORPAY_KEY_ID);

async function testConnection() {
  try {
  
    const options = {
      amount: 100, // 1 rupee
      currency: "INR",
      receipt: "test_receipt",
    };
    const order = await razorpay.orders.create(options);
    console.log("Success! Order created with ID:", order.id);
  } catch (error) {
    console.error("FAIL: Authentication failed or other error.");
    console.error(error);
  }
}

testConnection();

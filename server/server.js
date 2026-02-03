const express = require("express");
const path = require("path");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const admin = require("firebase-admin");
const helmet = require("helmet"); // 1. Security Headers
const rateLimit = require("express-rate-limit"); // 2. Rate Limiting
const Joi = require("joi"); // 3. Input Validation

const serviceAccount = require("./serviceAccountKey.json");

require("dotenv").config({ path: path.resolve(__dirname, "server.env") });

const app = express();

// --- SECURITY LAYER START ---
app.set("trust proxy", 1);
app.use((req, res, next) => {
  console.log(`Request received from IP: ${req.ip}`);
  next();
});
// 1. Helmet: Sets various HTTP headers to secure the app
app.use(helmet());

// 2. Rate Limiting: Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- SECURITY LAYER END ---

console.log(
  "Razorpay Key ID:",
  process.env.RAZORPAY_KEY_ID ? "Loaded" : "MISSING",
);

app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

if (
  !process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY_ID === "your_razorpay_key_id"
) {
  console.error("CRITICAL ERROR: Razorpay Key ID is not set.");
  process.exit(1);
}

// Optional: Root Route to verify server is running
app.get("/", (req, res) => {
  res.send("<h1>Server is Secure & Running! 🚀</h1>");
});

// --- VALIDATION SCHEMA ---
// This acts as a 'bouncer' for the create-order route
const orderSchema = Joi.object({
  amount: Joi.number().min(1).required(), // Amount must be a number >= 1
});

// Route 1: Create Order
app.post("/api/payment/create-order", async (req, res) => {
  try {
    // 3. Joi Validation: Check input before processing
    const { error } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid Amount: " + error.details[0].message,
      });
    }

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Route 2: Verify Payment
app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Simple validation to ensure data exists
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment Verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Route 3: Razorpay Webhook
app.post("/api/payment/webhook", async (req, res) => {
  const secret = "my_hidden_webhook_secret_123";

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Webhook Verified! Processing event...");

    const event = req.body;

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const orderRef = db.collection("orders").doc(payment.order_id);
      const doc = await orderRef.get();

      if (!doc.exists) {
        console.log("Saving missing order via Webhook...");
        await orderRef.set({
          orderId: payment.order_id,
          paymentId: payment.id,
          amount: payment.amount / 100,
          email: payment.email,
          status: "Processing",
          method: "Webhook (Backup)",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        console.log("Order already saved by Frontend. Skipping.");
      }
    }
    res.json({ status: "ok" });
  } else {
    console.error("Invalid Webhook Signature");
    res.status(400).json({ status: "invalid_signature" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

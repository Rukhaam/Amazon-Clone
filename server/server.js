const express = require("express");
const path = require("path");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const admin = require("firebase-admin");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Joi = require("joi");

// --- 1. BULLETPROOF CREDENTIAL LOADING ---
let serviceAccount;

try {
  // Option A: Base64 Encoded (The Bulletproof Method)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const buffer = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64",
    );
    serviceAccount = JSON.parse(buffer.toString("utf-8"));
  }
  // Option B: Local Development
  else {
    serviceAccount = require("./serviceAccountKey.json");
  }
} catch (err) {
  console.error("❌ FATAL ERROR: Could not load Firebase Credentials.");
  console.error(err);
  process.exit(1); // Stop the server if keys are broken
}

require("dotenv").config({ path: path.resolve(__dirname, "server.env") });

const app = express();

// --- 2. MIDDLEWARE ---
app.set("trust proxy", 1);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
      "https://amazon-clone-rukhaam.vercel.app",
    ],
    credentials: true,
  }),
);

// --- 3. INITIALIZATION ---

// Initialize Firebase
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin Initialized Successfully");
  }
} catch (error) {
  console.error("❌ Firebase Init Failed:", error.message);
  process.exit(1); // Crash immediately if Firebase fails
}

const db = admin.firestore();

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID) {
  console.error("❌ CRITICAL: Razorpay Key ID is missing.");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const orderSchema = Joi.object({
  amount: Joi.number().min(1).required(),
});

// --- 4. ROUTES ---

// Route: Create Order
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

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

// Route: Verify Payment
app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

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
      await db
        .collection("orders")
        .doc(razorpay_order_id)
        .set(
          {
            ...orderData,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "Processing",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      res.json({ success: true, message: "Payment Verified & Saved" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Route: Webhook
app.post("/api/payment/webhook", async (req, res) => {
  const secret = "my_hidden_webhook_secret_123";
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body;
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderRef = db.collection("orders").doc(payment.order_id);
      const doc = await orderRef.get();

      if (!doc.exists) {
        await orderRef.set({
          orderId: payment.order_id,
          paymentId: payment.id,
          amount: payment.amount / 100,
          email: payment.email,
          status: "Processing",
          method: "Webhook (Backup)",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    res.json({ status: "ok" });
  } else {
    res.status(400).json({ status: "invalid_signature" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const buffer = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64",
    );
    serviceAccount = JSON.parse(buffer.toString("utf-8"));
  } else {
    serviceAccount = require("./serviceAccountKey.json");
  }
} catch (err) {
  console.error("❌ FATAL ERROR: Could not load Firebase Credentials.");
  console.error(err);
  process.exit(1);
}

require("dotenv").config({ path: path.resolve(__dirname, "server.env") });

const app = express();

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

// --- FIX 1: Capture Raw Body for Webhooks ---
// We need the raw buffer to verify the Razorpay webhook signature accurately.
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);

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

    // Convert Rupee to Paise and ensure integer
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
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
      orderData, // Contains address/user details from frontend
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // --- FIX 2: Sanitize orderData ---
      // Prevent malicious overwrite of critical fields by extracting only safe keys.
      // Adjust these fields based on what your frontend actually sends.
      const safeOrderData = {
        userId: orderData?.userId || null,
        email: orderData?.userEmail || null,  // Map frontend userEmail to backend email
        amount: orderData?.amount || null,
        items: orderData?.items || [],
      };

      await db
        .collection("orders")
        .doc(razorpay_order_id)
        .set(
          {
            ...safeOrderData, // Use sanitized data
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
  // --- FIX 3: Use Env Variable & Raw Body ---
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("❌ CRITICAL: RAZORPAY_WEBHOOK_SECRET is missing.");
    return res.status(500).send("Server Configuration Error");
  }

  const shasum = crypto.createHmac("sha256", secret);

  // Use req.rawBody (captured by middleware) for accurate hash
  shasum.update(req.rawBody);

  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body;

    // Check for payment.captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderRef = db.collection("orders").doc(payment.order_id);

      try {
        const doc = await orderRef.get();

        // Only create if it doesn't exist (Backup for when frontend verification fails)
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
          console.log(
            `✅ Webhook: Order ${payment.order_id} created/recovered.`,
          );
        } else {
          console.log(`ℹ️ Webhook: Order ${payment.order_id} already exists.`);
        }
      } catch (err) {
        console.error("Webhook DB Error:", err);
      }
    }
    res.json({ status: "ok" });
  } else {
    console.warn("⚠️ Invalid Webhook Signature detected.");
    res.status(400).json({ status: "invalid_signature" });
  }
});

app.get("/", (req, res) => {
  res.send("API is working correctly! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

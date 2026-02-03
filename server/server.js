const express = require("express");
const path = require("path");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const admin = require("firebase-admin");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Joi = require("joi");

// --- 1. ROBUST CREDENTIAL LOADING ---
let serviceAccount;

// Option A: Production (Render) - Individual Variables
// This is safer than parsing a huge JSON string
if (process.env.FIREBASE_PRIVATE_KEY) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace standard escaped newlines if present
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}
// Option B: Legacy/Fallback (JSON String)
else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }
  } catch (err) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT JSON:", err);
  }
}
// Option C: Local Development (File)
else {
  try {
    serviceAccount = require("./serviceAccountKey.json");
  } catch (err) {
    console.log("No local serviceAccountKey.json found.");
  }
}

// Check if we actually found credentials
if (
  !serviceAccount ||
  (!serviceAccount.privateKey && !serviceAccount.private_key)
) {
  console.error("❌ FATAL: No valid Firebase Credentials found.");
  // We do NOT exit here to allow debugging logs to show,
  // but Firebase init will likely fail below.
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

// CORS Config
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
  // Do not crash immediately so we can see the logs
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

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// Initialize Express app
const app = express();

/* ================= MIDDLEWARE ================= */

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],  
  credentials: true
}));

/* ================= STATIC ================= */

app.use("/images", express.static("public/images"));
app.use("/invoices", express.static("invoices"));

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* ================= MYSQL CONNECTION TEST ================= */

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err);
  }
})();

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

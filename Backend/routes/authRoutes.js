const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db"); // mysql2/promise

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(401).json({ message: "Invalid Email" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

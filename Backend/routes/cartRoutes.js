const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await db.query("INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, 1)", [userId, productId]);
    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("CART ADD ERROR:", err);
    res.status(500).json({ message: "Cart error" });
  }
});

// GET CART ITEMS
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(`
      SELECT cart.id, cart.quantity, products.name, products.price, products.image
      FROM cart
      JOIN products ON cart.productId = products.id
      WHERE cart.userId = ?
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error("CART FETCH ERROR:", err);
    res.status(500).json({ message: "Cart fetch error" });
  }
});

// REMOVE ITEM
router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM cart WHERE id = ?", [id]);
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("CART REMOVE ERROR:", err);
    res.status(500).json({ message: "Remove error" });
  }
});

module.exports = router;

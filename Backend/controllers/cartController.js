const db = require("../config/db");

exports.addToCart = (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId)
    return res.status(400).json({ message: "Missing data" });

  db.query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
    [userId, productId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Cart error" });
      }
      res.json({ message: "Added to cart" });
    }
  );
};

exports.getCart = (req, res) => {
  db.query(
    `SELECT c.id, p.name, p.price, p.image, c.quantity
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id=?`,
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      res.json(result);
    }
  );
};

exports.removeItem = (req, res) => {
  db.query(
    "DELETE FROM cart WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Item removed" });
    }
  );
};

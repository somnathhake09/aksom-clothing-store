const db = require("../config/db");

exports.checkout = (req, res) => {
  const { userId, total } = req.body;

  if (!userId || !total)
    return res.status(400).json({ message: "Invalid data" });

  db.query(
    "INSERT INTO orders (user_id,total,status) VALUES (?,?,?)",
    [userId, total, "PLACED"],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Order failed" });
      }

      db.query("DELETE FROM cart WHERE user_id=?", [userId]);
      res.json({ message: "Order placed successfully" });
    }
  );
};

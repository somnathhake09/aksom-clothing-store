const db = require("../config/db");

exports.getProductsByCategory = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE category=?",
    [req.params.category],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      res.json(result);
    }
  );
};

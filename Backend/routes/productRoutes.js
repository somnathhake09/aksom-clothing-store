const express = require("express");
const router  = express.Router();
const db      = require("../config/db");

// ════════════════════════════════════════════════
// GET - Fetch products by category + optional subcategory
// Route  : GET /api/products/:category
// Query  : ?sub=t-shirts  (optional subcategory filter)
// Examples:
//   GET /api/products/men              -> all men products
//   GET /api/products/men?sub=t-shirts -> only t-shirts
//   GET /api/products/featured         -> all products
// ════════════════════════════════════════════════
router.get("/:category", async (req, res) => {
  try {
    const { category }    = req.params;
    const { sub, q }      = req.query;  // sub = subcategory, q = search query

    let sql    = "";
    let values = [];

    if (category === "featured") {
      // Return all products
      if (q) {
        sql    = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
        values = [`%${q}%`, `%${q}%`];
      } else {
        sql = "SELECT * FROM products";
      }

    } else if (sub) {
      // Filter by category AND subcategory
      // Also includes products with NULL subcategory when viewing all
      sql    = "SELECT * FROM products WHERE category = ? AND subcategory = ?";
      values = [category, sub];

    } else {
      // View All — return ALL products in this category (any subcategory or NULL)
      sql    = "SELECT * FROM products WHERE category = ?";
      values = [category];
    }

    const [rows] = await db.query(sql, values);
    res.json(rows);

  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ════════════════════════════════════════════════
// POST - Add a new product
// Route : POST /api/products
// Body  : { name, description, price, image, category, subcategory, isFeatured }
// ════════════════════════════════════════════════
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, category, subcategory, isFeatured } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "name, price and category are required" });
    }

    const sql = `
      INSERT INTO products (name, description, price, image, category, subcategory, isFeatured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      description  || "",
      price,
      image        || "",
      category,
      subcategory  || null,
      isFeatured   ? 1 : 0,
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message:   "Product added successfully",
      productId: result.insertId,
    });

  } catch (err) {
    console.error("PRODUCT ADD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ════════════════════════════════════════════════
// DELETE - Delete a product by ID
// Route : DELETE /api/products/:id
// ════════════════════════════════════════════════
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("PRODUCT DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ════════════════════════════════════════════════
// PUT - Update an existing product
// Route : PUT /api/products/:id
// Body  : { name, description, price, image, category, subcategory, isFeatured }
// ════════════════════════════════════════════════
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, subcategory, isFeatured } = req.body;

    const sql = `
      UPDATE products
      SET name = ?, description = ?, price = ?, image = ?,
          category = ?, subcategory = ?, isFeatured = ?
      WHERE id = ?
    `;

    const values = [
      name, description, price, image,
      category, subcategory || null,
      isFeatured ? 1 : 0,
      id,
    ];

    await db.query(sql, values);
    res.json({ message: "Product updated successfully" });

  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
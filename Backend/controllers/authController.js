const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hash = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hash],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "User already exists" });
      }
      res.json({ message: "Registration successful" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (!result || result.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = result[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });

      res.json({
        id: user.id,
        name: user.name,
        token
      });
    }
  );
};

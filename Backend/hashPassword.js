require("dotenv").config();
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {
  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed password:", hashedPassword);

  await db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, "admin@gmail.com"]
  );

  console.log("Password updated successfully!");
})();
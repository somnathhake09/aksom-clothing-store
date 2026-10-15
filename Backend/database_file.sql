CREATE DATABASE shoes_db;
USE shoes_db;

-- USERS
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
INSERT INTO users (name, email, password)
VALUES ('Admin', 'admin@gmail.com', '123456');

UPDATE users
SET password = '$2b$10$YOUR_HASH_HERE'
WHERE email = 'admin@gmail.com';

select * from users;
-- PRODUCTS
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150),
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  category VARCHAR(50),
  isFeatured BOOLEAN DEFAULT false
);

-- CART
CREATE TABLE cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  productId INT,
  quantity INT DEFAULT 1,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  totalAmount DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT,
  productId INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);


INSERT INTO products (name, description, price, image, category, isFeatured)
VALUES
('Nike Air Max', 'Comfort running shoe', 7999, '/images/men/Men_1.png', 'men', true),
('Nike Zoom Pro', 'Premium shoe', 9999, '/images/men/Men_2.png', 'men', true),
('Nike Air Jordan 1', 'Premium shoe', 8999, '/images/men/Men_3.png', 'men', true),
('Nike Air Force 1 Retro', 'Premium shoe', 9999, '/images/men/Men_4.png', 'men', true),
('Nike Zoom Fly 6', 'Premium shoe', 9999, '/images/men/Men_5.png', 'men', true),
('Nike Air Max Muse', 'Lightweight training shoe', 7999, '/images/Women/Women_1.png', 'women', false),
('Nike Zoom Vomero 5', 'Lightweight training shoe', 6999, '/images/Women/Women_2.png', 'women', false),
('Nike Pegasus', 'Lightweight training shoe', 6999, '/images/Women/Women_3.png', 'women', false),
('Nike Mind 002', 'Lightweight training shoe', 8999, '/images/Women/Women_4.png', 'women', false),
('Nike V2K Run', 'Lightweight training shoe', 9999, '/images/Women/Women_5.png', 'women', false),
('Nike Kids Run', 'Kids sports shoe', 3999, '/images/kids/Kids_1.png', 'kids', true),
('Nike Dunk Low', 'Kids sports shoe', 3999, '/images/kids/Kids_2.png', 'kids', true),
('Nike V5 RNR', 'Kids sports shoe', 3999, '/images/kids/Kids_3.png', 'kids', true),
('Nike Court Borough', 'Kids sports shoe', 3999, '/images/kids/Kids_4.png', 'kids', true),
('Nike Warning Label', 'Kids sports shoe', 3999, '/images/kids/Kids_5.png', 'kids', true);

update products set image = "/images/women/Women_3.jpg" where name = "Nike Pegasus";
update products set image = "/images/women/Women_4.jpg" where name = "Nike Mind 002";
update products set image = "/images/women/Women_5.jpg" where name = "Nike V2K Run";

SELECT email, password FROM users WHERE email = 'admin@gmail.com';

UPDATE users SET password = '<hashedPassword>' WHERE email = 'admin@gmail.com';

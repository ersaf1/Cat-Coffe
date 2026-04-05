-- Execute this script connected to the "cat_caffe" database.
-- Note: PostgreSQL does not support 'CREATE DATABASE IF NOT EXISTS'.
-- Please create the database manually using `CREATE DATABASE cat_caffe;` then connect to it before running this script.

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    badge VARCHAR(50) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_items (name, description, price, category, image, badge) VALUES
('Caramel Latte', 'Smooth espresso with creamy caramel and steamed milk', 32000, 'coffee', 'assets/hero-coffee.png', 'Best Seller'),
('Classic Espresso', 'Bold and rich double-shot espresso, perfectly extracted', 22000, 'coffee', 'assets/espresso.png', NULL),
('Cappuccino', 'Velvety foam over rich espresso with a touch of cocoa', 28000, 'coffee', 'assets/cappuccino.png', NULL),
('Matcha Latte', 'Premium Japanese matcha blended with creamy oat milk', 35000, 'non-coffee', 'assets/matcha-latte.png', 'Popular'),
('Cold Brew', '24-hour steeped cold brew, smooth and refreshing', 30000, 'coffee', 'assets/cold-brew.png', NULL),
('Café Mocha', 'Espresso meets rich Belgian chocolate and whipped cream', 34000, 'coffee', 'assets/mocha.png', NULL),
('Butter Croissant', 'Flaky, golden croissant baked fresh every morning', 18000, 'food', 'assets/croissant.png', 'Fresh'),
('Honey Americano', 'Classic Americano sweetened with natural wildflower honey', 26000, 'coffee', 'assets/espresso.png', NULL),
('Vanilla Iced Latte', 'Chilled latte with Madagascar vanilla bean syrup', 33000, 'coffee', 'assets/cold-brew.png', NULL),
('Chocolate Croissant', 'Buttery pastry filled with premium dark chocolate', 22000, 'food', 'assets/croissant.png', NULL),
('Strawberry Smoothie', 'Fresh strawberries blended with yogurt and honey', 25000, 'non-coffee', 'assets/hero-coffee.png', NULL);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    total_amount INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

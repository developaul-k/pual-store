DROP TABLE users;
DROP TABLE products;
DROP TABLE cart;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(200) UNIQUE NOT NULL,
	password VARCHAR(200) NOT NULL,
	full_name VARCHAR(50) NOT NULL,
	address VARCHAR(200) NOT NULL,
	phone VARCHAR(13) NOT NULL,
	date_of_birth TIMESTAMP NOT NULL
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	price INT NOT NULL DEFAULT 0,
	image VARCHAR(200)[],
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE cart (
	id SERIAL PRIMARY KEY,
	user_id SERIAL REFERENCES users ON DELETE CASCADE,
	product_id SERIAL REFERENCES products ON DELETE CASCADE,
	amount NUMERIC DEFAULT 1
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	user_id SERIAL REFERENCES users ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE products_orders (
	order_id SERIAL REFERENCES orders ON DELETE CASCADE,
	product_id SERIAL REFERENCES products ON DELETE CASCADE
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	body VARCHAR(500) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	user_id SERIAL REFERENCES users ON DELETE CASCADE,
	product_id SERIAL REFERENCES products ON DELETE CASCADE
);


INSERT INTO users (full_name, password, email, date_of_birth, address, phone)
VALUES ('김영주', '123', 'yjk@marpple.com', DATE '1990-04-30', '서울', '010-2184-5200');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro', 2000000, '{/images/iphone-12-pro-gold-hero.png}');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro blue', 2000000, '{/images/iphone-12-pro.jpeg}');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro graphite', 2000000, '{/images/iphone-12-pro-graphite-hero.png}');

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM products_orders;

SELECT o.id, o.user_id, po.product_id FROM orders o, products_orders po WHERE o.id = 1 AND po.order_id = 1;

SELECT * FROM products WHERE id IN (SELECT product_id FROM products_orders WHERE order_id = 1);

-- STEP1 카트 에 상품 추가
INSERT INTO cart (user_id, product_id, amount) VALUES(1, 1, 2);
INSERT INTO cart (user_id, product_id, amount) VALUES(1, 2, 5);
INSERT INTO cart (user_id, product_id, amount) VALUES(1, 3, 3);

SELECT * FROM cart;

-- STEP2 카트에 있는 상품 주문하기



-- 바로 구매일 경우 
WITH add_order AS (
	INSERT INTO orders (user_id) VALUES(1) RETURNING id
)
INSERT INTO products_orders (order_id, product_id) 
SELECT id, 1 AS product_id FROM add_order;


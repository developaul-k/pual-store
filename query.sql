DROP TABLE users;
DROP TABLE products;
DROP TABLE cart;

DROP TABLE comments;
DROP TABLE products_cart;

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
	amount INT DEFAULT 1
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

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro', 2000000, '{/images/iphone-12-pro-gold-hero.png}');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro blue', 2000000, '{/images/iphone-12-pro.jpeg}');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro graphite', 2000000, '{/images/iphone-12-pro-graphite-hero.png}');

INSERT INTO products (name, price, image)
VALUES ('iMac', 3000000, '{/images/product_image5.jpg, /images/product_image6.jpg}');

INSERT INTO products (name, price, image)
VALUES ('Mac mini', 1800000, '{/images/product_image5.jpg, /images/product_image6.jpg}');

INSERT INTO products (name, price, image)
VALUES ('Macbook Pro 16', 3300000, '{/images/product_image9.jpg, /images/product_image10.jpg}');

UPDATE products SET image = '{https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-12-family-select-2020?wid=882&amp;hei=1058&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1601844983000}', updated_at = now() WHERE id = 1;

SELECT * FROM users;
SELECT * FROM products ORDER BY updated_at DESC;
SELECT * FROM cart;


-- Simulation user1이 iMac (product_id = 3) 상품 2개를 장바구니에 담는다.
INSERT INTO cart (user_id, product_id, amount) VALUES (1, 3, 2);
-- Simulation user1이 iPhone 12 (product_id = 1) 상품 1개를 장바구니에 담는다.
INSERT INTO cart (user_id, product_id, amount) VALUES (1, 1, 1);

INSERT INTO cart (user_id, product_id, amount) VALUES (2, 1, 1);

-- 1. 회원 가입
INSERT INTO users (full_name, email, date_of_birth, address, phone)
VALUES ('개발자', 'developer@marpple.com', DATE '1985-01-01', '경기도', 01059399293);

-- 2. 장바구니 상품 리스트 가져오기
SELECT DISTINCT p.id, p.name, p.price, sum(c.amount) as amounts, p.image
FROM cart c, products p WHERE c.user_id = 1 AND c.product_id = p.id GROUP BY p.id;

--SELECT p.id, p.name, p.price, c.amount, p.image
--FROM cart c INNER JOIN products p ON (c.user_id = 1 AND c.product_id = p.id);

-- 3. 장바구니 총 수량, 총 금액 가져오기
SELECT p.id, p.name, (p.price * c.amount) as price, c.amount, p.image
FROM cart c, products p WHERE c.user_id = 1 AND p.id = c.product_id;


SELECT * FROM cart;

DELETE FROM cart WHERE id IN (1, 3);

ALTER TABLE cart ALTER COLUMN amount type INT;
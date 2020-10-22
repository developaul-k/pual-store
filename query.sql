DROP TABLE users;
DROP TABLE products;
DROP TABLE cart;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	full_name VARCHAR(50) NOT NULL,
	email VARCHAR(200) NOT NULL,
	address VARCHAR(200) NOT NULL,
	phone VARCHAR(13) NOT NULL,
	date_of_birth TIMESTAMP NOT NULL
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	price MONEY NOT NULL DEFAULT 0,
	image VARCHAR(200)[],
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE cart (
	id SERIAL PRIMARY KEY,
	user_id SERIAL REFERENCES users ON DELETE CASCADE,
	product_id SERIAL REFERENCES products ON DELETE CASCADE,
	amount NUMERIC DEFAULT 0
);

INSERT INTO users (full_name, email, date_of_birth, address, phone)
VALUES ('김영주', 'yjk@marpple.com', DATE '1990-04-30', '서울', '010-2184-5200');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12', 1500000, '{/images/product_image1.jpg, /images/product_image2.jpg}');

INSERT INTO products (name, price, image)
VALUES ('iPhone 12 Pro', 2000000, '{/images/product_image3.jpg, /images/product_image4.jpg}');

INSERT INTO products (name, price, image)
VALUES ('iMac', 3000000, '{/images/product_image5.jpg, /images/product_image6.jpg}');

INSERT INTO products (name, price, image)
VALUES ('Mac mini', 1800000, '{/images/product_image5.jpg, /images/product_image6.jpg}');

INSERT INTO products (name, price, image)
VALUES ('Macbook Pro 16', 3300000, '{/images/product_image9.jpg, /images/product_image10.jpg}');

UPDATE products SET image = '{https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/imac-215-selection-hero-201706?wid=892&hei=820&&qlt=80&.v=1570231130149, https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/imac-215-selection-hero-201706?wid=892&hei=820&&qlt=80&.v=1570231130149}', updated_at = now() WHERE id = 3;

SELECT * FROM users;
SELECT * FROM products;
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
SELECT p.id, p.name, p.price, c.amount, p.image
FROM cart c, products p WHERE c.user_id = 1 AND c.product_id = p.id;

--SELECT p.id, p.name, p.price, c.amount, p.image
--FROM cart c INNER JOIN products p ON (c.user_id = 1 AND c.product_id = p.id);

-- 3. 장바구니 총 수량, 총 금액 가져오기
SELECT sum(c.amount) AS total_amount, sum(price) AS total_price
FROM cart c, products p
WHERE c.user_id = 1 AND c.product_id = p.id;
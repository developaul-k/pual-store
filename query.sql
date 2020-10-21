DROP TABLE users;
DROP TABLE products;
DROP TABLE orders;
DROP TABLE delivery;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	full_name VARCHAR(50) NOT NULL,
	date_of_birth TIMESTAMP NOT NULL,
	address VARCHAR(200) NOT NULL,
	phone INT NOT NULL
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	user_id SERIAL REFERENCES users,
	product_id SERIAL REFERENCES products
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	price MONEY NOT NULL DEFAULT 0,
	image VARCHAR(200)[],
	created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE delivery (
	id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL,
	price MONEY NOT NULL DEFAULT 0
);

INSERT INTO users (full_name, date_of_birth, address, phone)
VALUES ('김영주', DATE '1990-04-30', '서울', 01021845200);

INSERT INTO products (name, price, image)
VALUES ('iPhone 12', 1500000, '{/images/product_image1.jpg, /images/product_image2.jpg}');

INSERT INTO orders (user_id, product_id) VALUES(1, 1);

INSERT INTO delivery (name) VALUES('무료배송');

INSERT INTO delivery (name, price) VALUES('유료배송', 3000);

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM delivery;
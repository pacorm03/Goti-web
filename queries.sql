CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(45) UNIQUE NOT NULL,
    password VARCHAR(45) NOT NULL
);

CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
    userID INT,
	score DOUBLE PRECISION NOT NULL,
    review TEXT,
    goodReview TEXT,
    badReview TEXT,
    FOREIGN KEY (userID)
    REFERENCES users(id)
);
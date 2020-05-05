DROP TABLE IF EXISTS zodic;
CREATE TABLE zodic(
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    famous TEXT,
    hates TEXT,
    favorites TEXT
);
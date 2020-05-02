DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    contact VARCHAR(255),
    status VARCHAR(255),
    category VARCHAR(255),
    due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title,description,contact,status,category) VALUES ('buy grocery','do after the lecture','mahmoud','not done','food');
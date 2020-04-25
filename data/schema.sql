DROP TABLE IF EXISTS exam;
CREATE TABLE exam (
    id SERIAL PRIMARY KEY,
    author VARCHAR (255),
    title VARCHAR (255),
    isbn VARCHAR (255),
    image_url VARCHAR (50000),
    description TEXT,
    bookshelf VARCHAR (255)
);

INSERT INTO exam (author,title,isbn,image_url,description,bookshelf) VALUES ('Knowledge Flow','Basics of Physics','9788179680247','http://books.google.com/books/content?id=IX1hCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','The term “Physics” comes from the Greek means “Information of nature” and in simple way it is an ancient and broad field of the science that focus to analyze and understand the natural phenomena of the universe. Our every moment that surrounded by physical phenomena and whether you feel it or not but you use basic physics every day. The basic physics covers everything from light and sound to nuclear science and geology. Physics have several branches including optical science, quantum mechanics, thermodynamics, electromagnetism and a unique field fluid mechanics. These branches of basic physics are broad and complex, studied by various different types of scientists and engineers. These fields help to describe how object and energy move around the world through our most important senses. This basic physics book describing the scientific study of matter and energy and covers various key concepts of science and engineering.','Science'),('William P. Berlinghoff','Math Through the Ages','0883857367','http://books.google.com/books/content?id=4ru6F85wGK4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','An informal and accessible overview of the history of mathematics.','Science')
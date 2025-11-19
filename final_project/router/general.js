const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try {
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const authorName = req.params.author.toLowerCase();
  let foundBooks = Object.entries(books)
  .filter(([isbn, book]) => book.author.toLowerCase() === authorName)
  .map(([isbn, book]) => ({isbn, ...book}));

  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({ message: "No books found by that author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  let foundBooks = Object.entries(books)
    .filter(([isbn, book]) => book.title.toLowerCase() === title)
    .map(([isbn, book]) => ({ isbn, ...book }));

  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({ message: "No books found with that title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  try {
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    }
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Function to get the book list using axios
const getAllBooks = async () => {
  try {
    const response = await axios.get("http://localhost:3000/");
    console.log("Task 10 - All books:");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book list:", error);
    throw error;
  }
};

// Function to get book by ISBN using promises
const getBookByISBN = (isbn) => {
  axios
    .get(`http://localhost:3000/isbn/${isbn}`)
    .then((response) => {
      console.log(`Task 11 - Book with ISBN ${isbn}:`);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(
        `Task 11 - Error fetching book with ISBN ${isbn}:`,
        error.message
      );
    });
};

// Function to get books by author using axios
const getBookByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    console.log(`Task 12 - Books by author "${author}":`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error);
    throw error;
  }
};

// Function to get books by title using promises
const getBooksByTitle = (title) => {
  axios.get(`http://localhost:3000/title/${title}`)
    .then((response) => {
      console.log(`Task 13 - Books with title "${title}":`);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(`Task 13 - Error fetching books with title "${title}":`, error.message);
    });
};

module.exports.general = public_users;

// Run these only when this file is executed directly, not when required by index.js
if (require.main === module) {
  // Make sure your server (index.js) is running on PORT 5000 before running this file:
  // node index.js   (in one terminal)
  // node router/general.js   (in another terminal) OR node final_project/router/general.js depending on your path

  getAllBooks();                     // Task 10
  getBookByISBN("1");                // Task 11 - use a valid ISBN that exists in your books.json
  getBookByAuthor("Chinua Achebe"); // Task 12 - use an author that exists
  getBooksByTitle("Things Fall Apart"); // Task 13 - use a title that exists
}

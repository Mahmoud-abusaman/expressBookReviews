const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "user should provide email and password" });
  if (!isValid(username)) return res.status(400).json({ message: "user with this username already exist" });
  if (password.length < 8) return res.status(400).json({ message: "password must be at least 8 char" });
  users.push({ username, password });
  return res.status(201).json({ message: "user create successfully, login now!" })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.status(200).json(books[+isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let { author } = req.params;
  let result = {}
  for (const key in books) {
    if (books[key].author === author) { result[key] = books[key]; }
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let { title } = req.params;
  let result = {}
  for (const key in books) {
    if (books[key].title === title) { result[key] = books[key]; }
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.status(200).json(books[+isbn].reviews);
});

const BASE_URL = 'http://localhost:5000';

async function getBooks() {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}
async function getBooksByIsbn(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}


async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function test() {
  console.log("\n get books", await getBooks());
  console.log("\n get books by ISBN", await getBooksByIsbn(1));
  console.log("\n get books by Author", await getBooksByAuthor("Unknown"));
  console.log("\n get books by title ", await getBooksByTitle("The Book Of Job"));
}
test()


module.exports.general = public_users;





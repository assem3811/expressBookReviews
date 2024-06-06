const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// get books using AXIOS
async function getAllBooks() {
    try {
        const response = await axios.get(BASE_URL);
        const books = response.data;

        res.status(200).json(books);
    } catch(err) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const reqIsbn = req.params.isbn;
  res.send(Object.values(books).filter(book => book.isbn === reqIsbn));
 });

// Get book details based on ISBN using AXIOS
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(BASE_URL+`/isbn/${isbn}`)
        const book = response.data;
        if(book) {
            res.status(200).json(book);
        } else {
            res.status(209).json({message: "Book not found!"});
        }
        
    } catch(err) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const reqAuthor = req.params.author;
  const result = [];
  for(let key in books) {
    if(books[key].author === reqAuthor) {
        result.push(books[key]);
    }
  }
  res.send(JSON.stringify(result, null, 4));
});

// Get book details based on author using AXIOS
async function getBookByAuthor(author) { 
    try {
        const response = await axios.get(BASE_URL);
        const fetchedBooks = response.data;
        const res = [];
        for(let key in fetchedBooks) {
            if(fetchedBooks[key].author === author) {
                result.push(fetchedBooks[key]);
            }
        }
        res.length > 0 ? res.status(200).json(res) :  res.status(208).json({message: "Author not found!"});
    } catch(err) {
        res.status(500).json({ message: 'Author not found' });
    }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const reqTitle = req.params.title;
  const result = [];
  for(let key in books) {
    if(books[key].title === reqTitle) {
        result.push(books[key]);
    }
  }
  res.send(JSON.stringify(result, null, 4));
});

//Get all book based on title usin AXIOS
async function getBookByTitle(title) {
    try {
        const response = await axios.get(BASE_URL+`/title/${title}`)
        const book = response.data;
       if(book) {
        res.status(200).json(book);
       } else {
        res.status(209).json({message: "Book not found!"});
       }
    } catch(err) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}

//  Get book review
public_users.get('/review/:title',function (req, res) {
  //Write your code here
  const reqIsbn = req.params.isbn;
  let book = Object.values(books).filter(book => book.isbn === reqIsbn);
  book.length > 0 ? res.send(book[0].reviews) : [];
});

//constant urls

const BASE_URL = "https://assemsalama-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";

module.exports.general = public_users;



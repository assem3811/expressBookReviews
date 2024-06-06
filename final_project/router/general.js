const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
};


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) {
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

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const reqIsbn = req.params.isbn;
  res.send(Object.values(books).filter(book => book.isbn === reqIsbn));
 });
  
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

//  Get book review
public_users.get('/review/:title',function (req, res) {
  //Write your code here
  const reqIsbn = req.params.isbn;
  let book = Object.values(books).filter(book => book.isbn === reqIsbn);
  book.length >0 ? res.send(book[0].reviews) : [];
});

module.exports.general = public_users;

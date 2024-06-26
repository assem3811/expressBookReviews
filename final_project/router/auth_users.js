const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password) {
    return res.status(404).json({message: "Username and Password are required"});
  }
  if(authenticatedUser(username, password)) {
   let accessToken = jwt.sign({
        data: password
      }, "access", { expiresIn: 60 * 60 });
  
      req.session.authorization = { accessToken,username }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login! Check username and password"});
}});

/**
 * I changed in the database records to be able to test the 2 below APIs with 
 * ISBN and reviews.
 */

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const { username } = req.session.authorization;
    const { review } = req.body;
    const { isbn } = req.params;
    if (!review) {
        return res.status(400).json({ message: 'Review is required.' });
    }

    let book = Object.values(books).filter(book => book.isbn === isbn);

    if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    let existingReview = book[0].reviews[username];

    if (existingReview) {
        book[0].reviews[username] = review;
    } else {
        book[0].reviews[username] = review;
    }

    res.status(200).json({ message: 'Review added successfully.' });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.authorization;
    const { isbn } = req.params;
    let book = Object.values(books).filter(book => book.isbn === isbn);
    if(book) {
        delete book[0].reviews[username];
        return res.status(200).send("Review removed Successfully!");
    } else {
        return res.status(404).json({message: `ISBN ${isbn} is not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

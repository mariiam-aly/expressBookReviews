const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
console.log(req.body)
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    await new Promise((resolve, reject)=>{
        resolve(res.send(books));
    })
  });
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
const bookByIsbn=books[req.params.isbn]
await new Promise((resolve, reject)=>{
    resolve(res.status(300).json(JSON.stringify(bookByIsbn)));
})
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
const bookByAuthor=Object.fromEntries(Object.entries(books).filter(([key,value]) => value.author==req.params.author));
  await new Promise((resolve, reject)=>{
    resolve(res.status(300).json(JSON.stringify(bookByAuthor)));
})
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
const bookByTitle=Object.fromEntries(Object.entries(books).filter(([key,value]) => value.title==req.params.title));
await new Promise((resolve, reject)=>{
    resolve(res.status(300).json(JSON.stringify(bookByTitle)));
})});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
const bookByIsbn=books[req.params.isbn];
  return res.status(300).json(JSON.stringify((bookByIsbn).reviews));
});

module.exports.general = public_users;

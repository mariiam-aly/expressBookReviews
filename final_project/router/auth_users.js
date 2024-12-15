const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const bookByIsbn=Object.fromEntries(Object.entries(books).filter(([key,value]) => value.isbn==req.params.isbn));
let reviews=Object.values(bookByIsbn)[0].reviews
const reviewExists=Object.fromEntries(Object.entries(reviews).filter(([key]) => req.session.authorization.username==key));
if(reviewExists.length>0){
    Object.values(reviewExists)[0]= req.body.review
}
else{
    const newReview={name:req.session.authorization.username, review:req.body.review}
reviews={...reviews,...newReview }
}
  return res.status(300).json(JSON.stringify((Object.values(bookByIsbn)[0].reviews)));

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

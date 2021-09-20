//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// already included in express now
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
//name of the database is userDB

const userSchema ={
  username: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);
// model with small 'm'
//mongod --dbpath ~/data/db (use this command)
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  //creating a new user
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // we picked the username and password from buttons name in register file.
  //saving to db
  newUser.save((err) => {
    if (err) console.log(err);
    else res.render("secrets");
  });
  //if there weren't any error we gonna res dot render secrets file
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser)
        if (foundUser.password === password) {
          res.render("secrets");
        }
        else{
            res.send("Incorrect Password");
        }
      else {
          res.send("User not found! kindly register");
      }
    }
  });
  
});

const PORT= process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`set up on port ${PORT}`);
});

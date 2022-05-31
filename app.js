//jshint esversion:6
//node js frameworkn require
//save our secret creditel global env variable
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

//set up our database mongoose
mongoose.connect("mongodb://127.0.0.1:27017/registerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() =>{
  console.log("Connected to the database");
})
.catch((err) =>{
  console.log(`Error connecting to the database. n${err}`);
})



//create register schema
const registerSchema = new mongoose.Schema({
  email: String,
  password: String
});

//encrypt only password with encryptionFields,
//automaticlay encrypt when we save(), and automaticlay decrypt find()
console.log(process.env.SECRET);
registerSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//create first model
const Register = mongoose.model("Register", registerSchema);






app.get("/", (req,res) =>{
  const Register = req.body;
  console.log(Register);
  res.render("home");
});

app.get("/login", (req,res) =>{
  res.render("login");
});

app.get("/register", (req,res) =>{
  res.render("register");
});

app.get("/submit", (req,res) =>{
  res.render("submit");
});

app.post("/register", (req,res) =>{
  const username = req.body.username;
  const password = req.body.password;


  //saved them to db
  const user = new Register({
    email: username,
    password: password
  });
  user.save((err) =>{
    if(!err){
      console.log("saved to the database successfuly");
      res.render("secrets");
    }else{
      console.log(`something went wrong ${err}`);
    }
  });

});

app.post("/login", (req,res) =>{
  //inlog input from user
  const username = req.body.username;
  const password = req.body.password;

  //check our inlog against register in db
  Register.findOne({email: username}, (err, foundUser) =>{
    //check if user inlog match register to db
    console.log(foundUser);
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
        console.log("matched");
      }
    }else{
      console.log(`Error couldn't find any username in database. ${err}`);
    }
  });
});


app.post("/secrets", (req,res) =>{
  console.log(req.body);
});














app.listen(3000, () =>{
  console.log("server started on port 3000.");
});

const express = require("express");
const bodyParser = require('body-parser')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const _ = require('lodash')
const Car = require("../models/Car");


//Load User Model
const User = require("../models/User");

var app = express();
jsonParser = bodyParser.json()

urlencodedParser = bodyParser.urlencoded({
  extended: false
})


//@route GET auth/users

router.get("/test", (req, res) => {
  res.send("USERS");
});

//@route GET auth/users/register
//@desc  Register user
//@access Public

router.post("/register", jsonParser, (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({user:{
            name:req.body.name,
            email: req.body.email,
            password:req.body.password}}
            ))
            .catch(err => {
              console.log(err);
            });
        });
      });
    }
  });
});

//@route GET auth/users/login
//@desc  login user/Returning JWT(json web token)
//@access Public
router.post("/login", jsonParser, (req, res) => {
  console.log(req.body)
  
  

  email = req.body.email
  password = req.body.password

 
  //find user by email
  User.findOne({
    email: email
  }).then(user => {
    //check for user
    
    if (!user) {
      return res.status(404).json({
        email: "User is not found"
      });
    }

    //check Passowrd  @note-> the password that user type is plaintext but the password stored in the DB is hashed
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        const payload = {
          // Create jwt payload
          id: user.id,
          name: user.name
        };
        
        jwt.sign(
          payload,
          keys.secretOrKey, {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token, //for formatting
              user: {
                name: user.name,
                email: user.email,
                id: user._id
              }

            });
          }
        );

        //Sign the token
      } else {
        return res.status(400).json({
          password: "Password is incorrect"
        });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
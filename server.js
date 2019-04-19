const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {
    ObjectID
} = require("mongodb");
const multer = require("multer");
const passport = require("passport");

const carRoutes = require("./routes/car");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");

//setting up express app
const app = express();

//DB config.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dzDB");

//passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport.js")(passport);

//body-parser middlewar
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json()); //to get the body of the request

app.use("/profile/cars", carRoutes); //Using carRoutes middleware( middleware - > code that runs between request and response)
app.use("/auth/users", userRoutes);
app.use("/profile", profileRoutes);

// if the user entered route that doesnt exist
app.use((req, res, next) => {
    res.status(404).json({
        msg: "U lost there is no route as u entered"
    });
});

app.listen(5000, () => {
    console.log("we are now listening");
});
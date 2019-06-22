const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require('cors');
var _ = require('underscore');
const {
    ObjectID
} = require("mongodb");
const multer = require("multer");
const passport = require("passport");
const path = require('path')

const carRoutes = require("./routes/car");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
// const db = require('./config/keys').mongoURI;

//setting up express app
const app = express();

const port = process.env.PORT || 5000 //Configuring app to work remotly(Heroku) or locally
//DB config.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dzDB", {
    useNewUrlParser: true
}, () => {
    console.log('Connected to DB')
});

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

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use("/profile/cars", carRoutes); //Using carRoutes middleware( middleware - > code that runs between request and response)
app.use("/auth/users", userRoutes);
app.use("/profile", profileRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))
// if the user entered route that doesnt exist
app.use((req, res, next) => {
    res.status(404).json({
        msg: "U lost there is no route as u entered"
    });
});

app.listen(port, () => {
    console.log("we are now listening");
});
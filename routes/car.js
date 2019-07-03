//this is cars route file.
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router(); //router object for routing;
const { ObjectID } = require("mongodb");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const passport = require("passport");
const Joi = require("joi");
//------------------------------------------------------------//
const User = require("../models/User");
const Car = require("../models/Car");
const validationSchema = require("../models/Car");
//----------------------------------------------------------------//
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     // const extension = file.mimetype.split("/")[1];//getting the extension(JPEG or JPG)
//     const extension = file.originalname.split(".")[1];
//     cb(null, file.fieldname + Date.now() + "." + extension); //field name is the name of the car(carImage)
//   }
// });
// const upload = multer({
//   storage: storage
// });
////////////////////////////////////////////////
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var upload = multer({
  storage: storage
});
/////////////////////////////////////////////////////////
jsonParser = bodyParser.json();

urlencodedParser = bodyParser.urlencoded({
  extended: false
});

//-------------------------------------------------------------------------------------------------------//

//Getting all cars from database//
router.get("/", (req, res) => {
  Car.find()
    .then(car => {
      res.send(car);
    })
    .catch(err => {
      res.send(err.message);
    });
});

router.put("/update/:id", jsonParser, (req, res) => {
  carFields = {};
  // carFields.make = req.body.make;
  const id = req.params.id;

  Car.findById(id)
    .then(car => {
      if (req.body.make) car.make = req.body.make;
      if (req.body.model) car.model = req.body.model;
      if (req.body.color) car.color = req.body.color;
      if (req.body.review) car.review = req.body.review;
      if (req.body.zipCode) car.zipCode = req.body.zipCode;
      if (req.body.year) car.year = req.body.year;
      if (req.body.status) car.status = req.body.stauts;
      if (req.body.sellerPhone) car.sellerPhone = req.body.sellerPhone;
      if (req.body.carType) car.carType = req.body.carType;
      if (req.body.carImage) car.carImage = req.file.path;
      if (req.body.carStyle) car.carStyle = req.body.carStyle;
      if (req.body.price) car.price = req.body.price;
      return car.save();
    })
    .then(car => {
      res.send(car);
    });
});
//------------------------------------------------------------------------------------------------------//
//Deleting speceific car;

router.delete("/:id", (req, res) => {
  id = req.params.id;

  Car.findOneAndRemove({
    _id: id
  })
    .then(car => {
      res.send(car);
    })
    .catch(err => {
      res.send(err.message.split(","));
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////
//This router for creating cars for authenticated user

router.post(
  "/addCar/:id",
  jsonParser,
  upload.single("carImage"),
  (req, res) => {
    //Get field

    zipCode = req.query;
    file = req.file;
    console.log(file);

    carFields = {};
    //carFields.user = req.user.id;
    carFields.user = req.params.id;

    if (req.body.make) carFields.make = req.body.make;
    if (req.body.model) carFields.model = req.body.model;
    if (req.body.zipCode) carFields.zipCode = req.body.zipCode;
    if (req.body.color) carFields.color = req.body.color;
    if (req.body.sellerPhone) carFields.sellerPhone = req.body.sellerPhone;
    if (req.body.year) carFields.year = req.body.year;
    carFields.carImage =
      "https://afternoon-atoll-25236.herokuapp.com/" + req.file.path;
    if (req.body.review) carFields.review = req.body.review;
    if (req.body.carType) carFields.carType = req.body.carType;
    if (req.body.status) carFields.status = req.body.status;
    if (req.body.carStyle) carFields.carStyle = req.body.carStyle;
    if (req.body.price) carFields.price = req.body.price;

    Car.findOne({
      zipCode: carFields.zipCode
    }).then(car => {
      if (car) {
        res.status(400).json("That car already exists");
      } else {
        new Car(carFields)
          .save()
          .then(car => res.json(car))
          .catch(err => res.json(err.message.split(",")));
      }
    });
  }
);
//---------------------------------------------------------------------//

//@route GET Trendycars
//@desc view all trendy cars
//@access public
router.get("/Trends", (req, res) => {
  Car.find({
    year: 2019
  })
    .then(cars => {
      res.send(cars);
    })
    .catch(err => {
      res.status(404).send(err.message.split(","));
    });
});

// Searching for any car in DB with matching specific criteria in the Query parameters with min and max price
router.get("/search/:min/:max", (req, res) => {
  query = req.query;
  min = req.params.min;
  max = req.params.max;

  console.log(req.query);

  Car.find(query)
    .then(
      cars => {
        if (cars.length === 0) {
          res.status(404).send(`No matching cars`);
        } else {
          const newCars = cars.filter(
            car => car.price > min && car.price < max
          );
          res.send(newCars);
        }
      } //else{
      //   res.send(cars)
      // }
    )
    .catch(err => {
      res.send(err.message.split(","));
    });
});

//Route Search for cars
//Its a PUBLIC route
router.get("/search", (req, res) => {
  query = req.query;

  console.log(req.query);

  Car.find(query)
    .then(cars => {
      if (cars.length === 0) {
        res.status(404).send(`No matching cars`);
      } else {
        res.send(cars);
      }
    })
    .catch(err => {
      res.send(err.message.split(","));
    });
});

// @route GET userAds
// @desc getting all ads. assoisated to a specific user
// @access private
router.get(
  "/userAds",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    user = req.user.id;
    console.log(user);
    Car.find({
      user
    })
      .then(cars => res.send(cars))
      .catch(err => res.send(err));
  }
);

// @route GET userAds
// @desc getting all ads. assoisated to a specific user
// @access private
router.get("/userAds/:id", (req, res) => {
  user = req.params.id;
  console.log(user);
  Car.find({
    user
  })
    .then(cars => res.send(cars))
    .catch(err => res.send(err));
});

// @route GET sepcific car
// @desc getting a specific car assoisated to a specific carID
// @access public

router.get("/specific/:id", (req, res) => {
  id = req.params.id;
  console.log(id);
  Car.find({
    _id: id
  })
    .then(cars => res.send(cars))
    .catch(err => res.send(err));
});

// @route POST
// @desc posting and and find the matched cars for the posted criteria
// @access public
router.post("/find", jsonParser, (req, res) => {
  min = req.body.min;
  max = req.body.max;
  carFields = {};

  if (req.body.make) carFields.make = req.body.make;
  if (req.body.model) carFields.model = req.body.model;
  if (req.body.year) carFields.year = req.body.year;
  if (req.body.carType) carFields.carType = req.body.carType;
  if (req.body.status) carFields.status = req.body.status;
  if (req.body.carStyle) carFields.carStyle = req.body.carStyle;
  if (req.body.price) carFields.price = req.body.price;

  console.log(carFields);

  //Car.find(carFields).then(cars => res.send(cars)).catch(err => res.send(err.message.split(',')))

  Car.find(carFields)
    .then(cars => {
      if (cars.length === 0) {
        res.status(404).send(`No matching cars`);
      } else if (!max && !min) {
        res.send(cars);
      } else {
        const newCars = cars.filter(car => car.price > min && car.price < max);
        if (newCars.length == 0) {
          return res.send("No cars in this Price Range");
        }

        res.send(newCars);
      }
    })
    .catch(err => {
      res.send(err.message.split(","));
    });
});

// @route GET top car
// @desc getting top 2 trendy cars to view them in home page
// @access public
router.get("/topCars", (req, res) => {
  Car.find({
    year: 2019
  })
    .limit(2)
    .then(cars => res.send(cars))
    .catch(err => res.send(err.message.split(",")));
});

// router.post("/upload", function(req, res) {
//   upload(req, res, function(err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     return res.status(200).send(req.file);
//   });
// });

router.get("/makes", (req, res) => {
  Car.find()
    .then(cars => {
      const distinctMakes = [...new Set(cars.map(x => x.make))];
      res.send(distinctMakes);
    })
    .catch(err => res.send(err));
});
router.get("/models/:make", (req, res) => {
  make = req.params.make;

  Car.find()
    .then(cars => {
      cars.forEach(car => {
        if (car.make === make) {
          res.send([car.model])
        }else{
          res.send('no matching models for this make')
        }
          
      })
    }).catch(err => res.send(err.message.split(',')))
    
});

module.exports = router;

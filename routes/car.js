//this is cars route file.
const express = require("express");
const router = express.Router(); //router object for routing;
const {
  ObjectID
} = require("mongodb");
const multer = require("multer");
const passport = require("passport");
//------------------------------------------------------------//
const User = require("../models/User");
const Car = require("../models/Car");
//----------------------------------------------------------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + Date.now() + "." + extension);
  }
});
const upload = multer({
  storage: storage
});

//-------------------------------------------------------------------------------------------------------//

//Getting all cars from database//
router.get('/', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://afternoon-atoll-25236.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  res.send('cors problem fixed:)');
});
router.get("/", (req, res) => {
  Car.find()
    .then(car => {
      res.send(car);
    })
    .catch(err => {
      res.send(err.message);
    });
});

router.put("/update/:id", (req, res) => {
  carFields = {};
  // carFields.make = req.body.make;
  const id = req.params.id;

  Car.findById(
      id
    )
    .then(car => {
      if (req.body.make) car.make = req.body.make
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

router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    id = req.params.id;

    Car.findOneAndRemove({
        _id: id
      })
      .then(car => {
        res.send(car);
      })
      .catch(err => {
        res.send(err.message);
      });
  }
);
//////////////////////////////////////////////////////////////////////////////////////////////
//This router for creating cars for authenticated user

router.post(
  "/addCar",
  upload.single("carImage"),
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //Get field
    zipCode = req.query;

    carFields = {};
    carFields.zipCode = req.body.zipCode;
    carFields.make = req.body.make;
    carFields.model = req.body.model;
    carFields.color = req.body.color;
    carFields.sellerPhone = req.body.sellerPhone;
    carFields.year = req.body.year;
    carFields.carImage = req.file.path;
    carFields.review = req.body.review;
    carFields.carType = req.body.carType;
    carFields.status = req.body.status;
    carFields.carStyle = req.body.carStyle;
    carFields.price = req.body.price;


    Car.findOne({
      zipCode: carFields.zipCode
    }).then(car => {
      if (car) {
        res.status(400).json("That car already exists");
      } else {
        new Car(carFields)
          .save()
          .then(car => res.json(car))
          .catch(err => res.json(err));
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
      res.status(404).send(err);
    });
});

// Searching for any car in DB with matching specific criteria in the Query parameters
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
      res.send(err);
    });
});

module.exports = router;
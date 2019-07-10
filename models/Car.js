const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi')

const carSchema = new Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  zipCode: {
    type: Number,
    required: true,
    
  },
  color: {
    type: String,

  },
  description: {
    type: String,

  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  price: {
    type: Number,

  },
  sellerPhone: {
    type: Number,

  },
  year: {
    type: Number,

  },
  carImage: {
    // data: Buffer,
    // contentType:String
    type:String
    
  },
  status: {
    type: String

  },
  carType: {
    type: String

  },
  carStyle: {
    type: String

  },
  extColor: {
    type:String
  },
  intColor: {
    type:String
  },
  transmission:{
    type:String
  },
  numberOfDoors:{
    type:Number
  },
  mileage:{
    type:Number
  },
  fuelType:{
    type:String
  }

});

// const validationSchema = Joi.object().keys({
//   make:Joi.string().min(3).trim().required(),
//   carImage:Joi.string().required()
// })
const Car = mongoose.model("car", carSchema);

module.exports = Car;
// module.exports = validationSchema;
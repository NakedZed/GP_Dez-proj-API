const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    unique: true
  },
  color: {
    type: String,
   
  },
  review: {
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
    type: String,
    required: true
  },
  status: {
    type: String,
    
  },
  carType: {
    type: String,
    
  },
  carStyle: {
    type: String,
    
  }
});

const Car = mongoose.model("car", carSchema);

module.exports = Car;
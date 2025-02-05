const mongoose = require("mongoose");

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://nadiarajpoot44:678yd2X0pLJ2Qdm8@cluster0.ncmyx.mongodb.net/");
  
}

module.exports = connectDB;
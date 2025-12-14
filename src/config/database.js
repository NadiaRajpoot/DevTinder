const mongoose = require("mongoose");

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://nadiarajpoot44_db_user:drn9FhmHj7EEGcsz@cluster0.pl1qrrw.mongodb.net/devTinder");
  
}

module.exports = connectDB;

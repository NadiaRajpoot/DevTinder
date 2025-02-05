const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

const connectDB = require("./config/database");

connectDB()
  .then(() => {
    console.log("database connection is establised...");
    app.listen(4444, () => {
      console.log("server running successfully");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

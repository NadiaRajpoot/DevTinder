const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

//defining routes

app.use("/", (req, res, next) => {
  next();
});

app.get(
  "/user",
  [
    (req, res, next) => {
      next();
    },
    (req, res, next) => {
      next();
    },
  ],

  (req, res, next) => {
    console.log("3");
    // res.send("hello3");
    next();
  },
  (req, res, next) => {
    console.log("4");
    // res.send("hello4");
    next();
  }
);

app.listen(4444, () => {
  console.log("server running successfully");
});

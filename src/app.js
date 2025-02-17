const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connection is establised...");
    app.listen(4444, () => {
      console.log("server running successfully");
    });
  })
  .catch((err) => {
    console.log(`error: ${err.message}`);
  });

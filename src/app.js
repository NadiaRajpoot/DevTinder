const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");



app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);





//send connection request
app.post("/sendConnectionrequest" , async(req ,res)=>{
  try{
    const user = req.user;
  res.send(`${user.firstName} sent connection request`);
  }catch (err) {
  res.status(400).send(`Error: ${err.message}`);
}
})

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

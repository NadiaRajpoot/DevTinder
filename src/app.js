const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

//defining routes

app.get("/user", (req, res)=>{
  console.log(req.query);
  res.send("hello");
})
app.get("/user/:userId", (req, res)=>{
  console.log(req.params);
  res.send("hello1");
})
app.listen(4444, () => {
  console.log("server running successfully");
});

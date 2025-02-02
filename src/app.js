const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

//defining routes
app.use("/test" ,(req , res)=>{
  res.send("hello from server");
})
app.use("/hello" ,(req , res)=>{
  res.send("hello hello hello");
})
app.use("/about" ,(req , res)=>{
  res.send("hello this is devTinder");
})

app.listen(4444 , ()=>{
    console.log("server running successfully");
});
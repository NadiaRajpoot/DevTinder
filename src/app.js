const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

//defining routes

app.get("/a(bc)?c", (req, res)=>{
  res.send("hello from server1");
})
app.get("/ab?c", (req, res)=>{
  res.send("hello from server");
})

app.get("/a(bc)+d", (req, res)=>{
  res.send("hello from server3");
})
app.get("/ab+c", (req, res)=>{
  res.send("hello from server2");
})
app.get("/ab*c", (req, res)=>{
  res.send("hello from nadiyee");
})
app.get("/*fly$/", (req, res)=>{
  res.send("hello from butterfly");
})
app.listen(4444, () => {
  console.log("server running successfully");
});

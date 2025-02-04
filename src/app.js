const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const adminAuth = require("./middlewares/AdminAuth");

app.get("/admin/getData", adminAuth, (req, res) => {
  console.log("getting admin Data");
  res.send("getData");
});
app.get("/admin/deleteData", (req, res) => {
  console.log("deleting admin data");
  res.send("delete Data");
});

app.listen(4444, () => {
  console.log("server running successfully");
});

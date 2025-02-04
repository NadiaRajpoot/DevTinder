const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

app.use("/admin", (req, res, next) => {
  const token = "xyz";
  const isAdmnAuth = token === "xyz";
  console.log("/admin");
  if (!isAdmnAuth) {
    res.status(401).send("unauth");
  } else {
    next();
  }
});

app.get("/admin/getData", (req, res) => {
  console.log("/admindata");
  res.send("getData")
});

app.listen(4444, () => {
  console.log("server running successfully");
});

const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const adminAuth = require("./middlewares/AdminAuth");


app.get("/admin/deleteData", (req, res) => {
try{
 res.send("there is no error in this middleware")
} catch(err){
  res.status(500).send(err.message)
}
});

app.get("/admin/getData", (req, res) => {
  throw new error();
  res.status(500).send(err.message)
}
);
app.use("/", (err ,req, res,next) => {
  if(err)
    res.status(500).send("the wildcard error")
});



app.listen(4444, () => {
  console.log("server running successfully");
});

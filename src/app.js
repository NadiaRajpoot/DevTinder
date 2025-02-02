const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

app.listen(3000 , ()=>{
    console.log("server running successfully");
});
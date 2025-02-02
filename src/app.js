const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express

//defining routes
app.use("/user",(req,res)=>{
  //adding data
  res.send("I am a use call")
})
app.get("/user" , (req,res)=>{
  res.send({name: "nadiyee" , surname : "rajpoot"});
})

app.post("/user",(req,res)=>{
  //adding data
  res.send("data added successfully")
})
app.delete("/user",(req,res)=>{
  //data deleted
   res.send("data deleted successfully");
})

app.patch("/user" ,(req,res)=>{
  //data updated
  res.send("data updated successfully")
})

app.listen(4444 , ()=>{
    console.log("server running successfully");
});
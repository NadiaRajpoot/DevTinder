const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const User = require("./models/user");
const connectDB = require("./config/database");

app.use(express.json());

//adding user to the dataBase
// app.post("/signup", async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     res.send("user added successfully");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// //getting user to the database
// app.get("/user" , async(req , res)=>{
//   try{
//     const user = await User.findOne({emailId: req.body.emailId});
//     res.send(user);
//   }
//   catch(err){
//     res.status(400).send(`error: ${err.message}`);
//   }
// })

// getting all users
// app.get("/user", async (req, res) => {
//   try {
//     const users = await User.find();

//     if (!users) {
//       res.status(404).send("user not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send(`error: ${err.message}`);
//   }
// });

//getting count of users with specific property
app.get("/user/:firstName", async (req, res) => {
  console.log(req.params.firstName)
  try {
    const count = await User.countDocuments({ firstName: req.params.firstName });

    res.json({ count }); // ✅ Always send as JSON
  } catch (err) {
    res.status(400).json({ error: "wrong" });
  }
});


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

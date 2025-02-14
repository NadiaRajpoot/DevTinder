const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const User = require("./models/user");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const userAuth = require("./middlewares/userAuth");

const {
  validateSignUpData,
  
} = require("./utils/validation");


app.use(express.json());
app.use(cookieParser());

// Add a new user to the database
app.post("/signup", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);

    //encrypting password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new instance of user Model-
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//login Api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
  //checking whether user exists or not!
    if (!user) {
      throw new Error("invalid credentials!");
    }

    //checking if password is correct or not!
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid != true) {
      throw new Error("invalid credentials!");
    } else {
      const token = await user.getJwt();
      res.cookie("token" , token ,{expires: new Date(Date.now() +  60 * 1000)});
      res.send("login successfull");
    }
  } catch (err) {
    res.status(400).send(`Error:  ${err.message}`);
  }
});


//profile api
app.get("/profile" ,userAuth,async(req, res)=>{
 try{

 const user = req.user;
   if(!user){
    throw new Error("user doesn't exist!")
   }
  res.send(user);

 } catch (err) {
  res.status(400).send(`Error: ${err.message}`);
}
})


//send connection request
app.post("/sendConnectionrequest" ,userAuth, async(req ,res)=>{
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

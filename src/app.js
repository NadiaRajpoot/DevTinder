const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const User = require("./models/user");
const connectDB = require("./config/database");

app.use(express.json());

// Add a new user to the database
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    if(req.body.skills.length>=10){
      const errorMessage = "You can only add a maximum of 10 skills. Please remove some skills and try again."
      throw new Error(errorMessage);
    }
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});



// Get a user by email
app.get("/user/email", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

// Get a user by ID
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});


// Delete a user by ID
app.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});


// Update a user by ID
app.patch("/user/:userId", async (req, res) => {

  try {
    const ALLOWED_UPDATES = ['photoURL', 'skills', 'about' , 'gender', 'phone'];
    // Get the keys from the request body
    const requestedUpdates = Object.keys(req.body);

    // Check if all requested updates are allowed
    const isAllowedUpdates = requestedUpdates.every((k)=>ALLOWED_UPDATES.includes(k));

    if (!isAllowedUpdates) {
        // Find the keys that are not allowed
        const notAllowedUpdates = requestedUpdates.filter((k) => !ALLOWED_UPDATES.includes(k));
        const errorMessage = `You are trying to update the following keys which are not allowed: 
        ${notAllowedUpdates.join(', ')}`;
        
        // Throw an error with the detailed message
        throw new Error(errorMessage);
    }

    //consition for limited  skills
    if(req.body.skills.length>=10){
      const errorMessage = "You can only add a maximum of 10 skills. Please remove some skills and try again."
      throw new Error(errorMessage);
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId, req.body, {runValidators: true}

    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
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

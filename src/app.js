const express = require("express"); //requirng express.js
const app = new express(); //creating an instance of express
const User = require("./models/user");
const connectDB = require("./config/database");
const {
  validateSignUpData,
  validateUpdateData,
} = require("./utils/validation");
const bycrypt = require("bcrypt");

app.use(express.json());

// Add a new user to the database
app.post("/signup", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);

    //encrypting password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 10);

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
    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (isPasswordValid != true) {
      throw new Error("invalid credentials!");
    } else {
      res.send("login successfull");
    }
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
    //validation
    validateUpdateData(req);
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      runValidators: true,
    });

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

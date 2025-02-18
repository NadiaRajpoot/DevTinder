const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../utils/validation");

// Add a new user to the database
router.post("/signup", async (req, res) => {
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
   res.json({message: "user added successfully?"})
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//login Api
router.post("/login", async (req, res) => {
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
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("login successfull");
    }
  } catch (err) {
    res.status(400).send(`Error:  ${err.message}`);
  }
});

//logout api
router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("logout successfull");
});

module.exports = router;

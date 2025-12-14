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

    // Validate input
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = await user.getJwt();

    // Dynamic cookie configuration
    const isProduction = process.env.NODE_ENV === 'production';
    const isHTTPS = req.protocol === 'https' || isProduction;

    const cookieOptions = {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      secure: isHTTPS, // true in production/HTTPS, false in local development
      sameSite: isHTTPS ? "none" : "lax", // "none" for HTTPS, "lax" for HTTP
      path: "/" // Available on all routes
    };

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Remove sensitive data from user object
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userResponse,
      token: token // Optional: include token in response for mobile apps/Postman
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

//logout api
router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successfull");
});

module.exports = router;

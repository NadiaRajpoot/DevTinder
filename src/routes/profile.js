const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const { validateProfileUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");

// Profile API
router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User doesn't exist!");
    }
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve profile",
      error: err.message,
    });
  }
});

// Profile Edit API
router.patch("/edit", userAuth, async (req, res) => {
  try {
    console.log(validateProfileUpdateData(req));

    if (!validateProfileUpdateData(req)) {
      throw new Error("Invalid edit request!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: `${loggedInUser.firstName}, your profile is updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
});

// Update Profile Password
router.patch("/password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = req.user;

    // Validate current password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid current password! Please try again.");
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = newPasswordHash;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been updated successfully.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update password",
      error: err.message,
    });
  }
});

module.exports = router;

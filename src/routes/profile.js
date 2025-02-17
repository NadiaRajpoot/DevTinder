const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const { validateProfileUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//profile api
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user doesn't exist!");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//profile edit api
router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (validateProfileUpdateData(req)) {
      throw new Erorr("invalid edit request!");
    } else {
      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });
      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.firstName} , your profile is updated successfully!`,
        data: loggedInUser,
      });
    }
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//update profile password
router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = req.user;

    // Validate current password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid current password! Please try again.");
    }

    //hashedPassword
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    // Update password
    user.password = newPasswordHash;
    await user.save();
    res.send("Your password has been updated successfully.");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = router;

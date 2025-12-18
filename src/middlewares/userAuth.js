const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // ✅ FIXED

    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no token",
      });
    }

    const decodedObj = jwt.verify(token, "DevTinder@4444#");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.name === "TokenExpiredError"
        ? "Unauthorized: token expired"
        : "Unauthorized: invalid token",
    });
  }
};

module.exports = userAuth;

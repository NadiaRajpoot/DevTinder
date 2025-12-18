const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies.token || {};
    console.log("Token from cookies:", token);
    if (!token) {
      
      return res.status(401).json({ success: false, message: "Unauthorized: no token" });
    }
    // verify the token
    const decodedObj = await jwt.verify(token, "DevTinder@4444#");
    const { _id } = decodedObj;

    // find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    const isExpired = err && err.name === "TokenExpiredError";
    const isInvalid = err && (err.name === "JsonWebTokenError" || err.name === "NotBeforeError");
    const status = isExpired || isInvalid ? 401 : 400;
    const message = isExpired
      ? "Unauthorized: token expired"
      : isInvalid
      ? "Unauthorized: invalid token"
      : "Error: " + err.message;
    res.status(status).json({ success: false, message });
  }
};
module.exports = userAuth;

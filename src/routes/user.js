const express = require("express");
const userAuth = require("../middlewares/userAuth"); // Middleware to authenticate users
const ConnectionRequest = require("../models/conncetionRequest"); // ConnectionRequest model
const User = require("../models/user"); // User model
const router = express.Router();

// Fields to include in user data for safe sharing
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "about",
  "age",
  "gender",
  "mobileNumber",
  "photoURL",
  "skills",
];

// API to get all received connection requests
router.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // Authenticated user object

    // Fetch all received connection requests with "interested" status
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // Populate sender's data

    if (!connectionRequests) {
      return res.status(404).json({ message: "No pending requests found!" });
    }

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

// API to get matched users (mutual accepted requests)
router.get("/user/requests/matched", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // Authenticated user object


    // Fetch all requests where the user is either the sender or receiver and status is "accepted"
    const matchedRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA) // Populate sender's data
      .populate("toUserId", USER_SAFE_DATA); // Populate receiver's data

    // Extract only the matched user data (the other user in the connection)
    const data = matchedRequests.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId; // If the logged-in user is the sender, return the receiver
      }
      return row.fromUserId; // Otherwise, return the sender
    });

    if (!matchedRequests) {
      return res.status(404).json({ message: "No matches found!" });
    }

    res.json({ message: "Data fetched successfully!", data: data });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

// API to get user feed (users not yet connected or interacted with)
router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // Authenticated user object

    const pageNumber = parseInt(req.query.page) || 1;
   let limit = req.query.limit || 10
    limit = limit > 50  ?  50 : limit;
    const skip = (pageNumber-1) * limit;


    // Fetch all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); // Only select user IDs

    const hideUsersFromFeed = new Set(); // Use a set to store IDs of users to hide

    // Add both sender and receiver IDs from the connection requests to the set
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Fetch users not involved in any connection with the logged-in user
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) }, // Exclude IDs in the set
      _id: {$ne: loggedInUser._id}
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)

    res.json({ message: "Data fetched successfully!", data: users });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = router;

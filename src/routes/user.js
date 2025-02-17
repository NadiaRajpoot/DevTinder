const express = require("express");
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/conncetionRequest");
const { populate } = require("../models/user");
const router = express.Router();

const SAFE_DATA = ["firstName", "lastName"];

//api for getting all recieved requests
router.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);

    if (!connectionRequests) {
      res.status(404).json({ message: "No pending requests found!" });
    }

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//API for getting matched
router.get("/user/requests/matched", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //matched requests
    const matchedRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    const data = matchedRequests.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    if (!matchedRequests) {
      res.status(404).json({ messsage: "No matched found!" });
    }

    res.json({ message: "data fetched successfully!", data: data });

    //display according to toUser and fromUser
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = router;

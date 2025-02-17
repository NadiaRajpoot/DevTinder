const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/conncetionRequest");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `invalid status type: ${status}` });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res
        .status(404)
        .json({ message: `user with this ${toUserId} not found` });
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: `connection requst already exist` });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    if (data.status === "interested") {
      return res.json({
        message: `${req.user.firstName} is interested in connecting with User ${toUser.firstName}`,
        status: "success",
        data,
      });
    } else if (data.status === "ignored") {
      return res.json({
        message: `${req.user.firstName} ignored the user ${toUser.firstName}`,
        status: "success",
        data,
      });
    }
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

//API to accept connection request
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //status validation
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status is not allowed!" });
      }
      //valid request id
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res.json({
        message: `Connection request is ${status}!`,
        data: data,
      });
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  }
);
module.exports = router;

const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/conncetionRequest");
const User = require("../models/user")

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested" , "ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message: `invalid status type: ${status}`})
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
       return res.status(404).json({message: `user with this ${toUserId} not found`});

    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId,toUserId},
            {fromUserId: toUserId , toUserId : fromUserId}
        ]
    });

    if(existingConnectionRequest){
        
 return res.status(400).json({message:  `connection requst already exist`})
       
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
        });}
       


  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});
module.exports = router;

const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation
router.post("/",async(req,res)=>{
  const newConversation = new Conversation({
    members:[req.body.senderID,req.body.recieverID],
  });
  try {
    const convo = await newConversation.save();
    res.status(200).json(convo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user convo 
router.get("/:userID", async(req,res)=>{
  try {
    const conversation = await Conversation.find({
      members:{$in:[req.params.userID]},
    })
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err)    
  }
})

module.exports = router;
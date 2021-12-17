const router = require("express").Router();
const Message = require("../models/Message");

// add message
router.post("/",async(req,res)=>{
  const newMessage = new Message(req.body);
  try {
    const message = await newMessage.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get messages
router.get("/:conversationID",async(req,res)=>{
  try {
    const messages = await Message.find({
      conversationID:req.params.conversationID,
    })
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
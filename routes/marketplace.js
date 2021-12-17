const router = require("express").Router();
const User = require("../models/User");
const Marketplace = require("../models/Marketplace");

// Create Post
router.post("/", async (req, res) => {
  const newPost = new Marketplace(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like/Dislike Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Marketplace.findById(req.params.id);
    if (!post.likes.includes(req.body.userID)) {
      await post.updateOne({ $push: { likes: req.body.userID } });
      res.status(200).json("Liked post.");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userID } });
      res.status(200).json("Disliked post.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Marketplace.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Post
router.get("/feed/:userID", async (req, res) => {
  try {
      const user = await User.findById(req.params.userID);
      const userPosts = await Marketplace.find({userID: user._id});
      const friendPosts = await Promise.all(
          user.following.map((friendID)=>{
              return Marketplace.find({userID: friendID});
          })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
  } catch(err) {
      res.status(500).json(err);
  }
});

// Get All User Post
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Marketplace.find({ userID: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

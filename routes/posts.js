const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res)=>{
    res.send("posts route...")
})

// Create Post
router.post("/", async(req,res)=>{
    const newPost = new Post(req.body)
    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
});

// Update Post
router.put("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userID === req.body.userID) {
            await post.updateOne({$set:req.body});
            res.status(200).json("Update successful.");
        } else {
            res.status(403).json("Permission denied. Users can only update their own posts.")
        }    
    } catch(err) {
        res.status(500).json(err);
    }
});

// Delete Post
router.delete("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userID === req.body.userID) {
            await post.deleteOne();
            res.status(200).json("Deletion successful.");
        } else {
            res.status(403).json("Permission denied. Users can only delete their own posts.")
        }    
    } catch(err) {
        res.status(500).json(err);
    }
});

// Like/Dislike Post
router.put("/:id/like", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userID)){
            await post.updateOne({$push: {likes: req.body.userID}});
            res.status(200).json("Liked post.")
        } else {
            await post.updateOne({$pull: {likes: req.body.userID}});
            res.status(200).json("Disliked post.")
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get Post
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get All Post
router.get("/feed/:userID", async(req, res)=>{
    try {
        const user = await User.findById(req.params.userID);
        const userPosts = await Post.find({userID: user._id});
        const friendPosts = await Promise.all(
            user.following.map((friendID)=>{
                return Post.find({userID: friendID});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get All Marketplace Post

// Get All User Post
router.get("/profile/:username", async(req, res)=>{
    try {
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({userID:user._id})
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;
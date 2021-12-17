const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Update User
router.put("/:id", async(req, res)=>{
    try {
        const modifier = await User.findById(req.body.userID);
        if(req.body.userID === req.params.id || modifier.isAdmin) {
            // encrypt new password
            if(req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            // update
            const {userID, ...other} = req.body;
            const user = await User.findByIdAndUpdate(req.params.id, {$set: other});
            res.status(200).json("Update successful.")
        } else {
            return res.status(403).json("Permission denied. Users can only update their own account.")
        }
    } catch(err) {
        return res.status(500).json(err);
    }
});

// Delete User
router.delete("/:id", async(req, res)=>{
    try {
        const modifier = await User.findById(req.body.userID);
        if(req.body.userID === req.params.id || modifier.isAdmin) {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deletion successful.")
        } else {
            return res.status(403).json("Permission denied. Users can only delete their own account.")
        }
    } catch(err) {
        return res.status(500).json(err);
    }
});

// Get User
router.get("/", async(req, res)=>{
    const userID = req.query.userID;
    const username = req.query.username;

    try {
        const user = userID 
            ? await User.findById(userID) 
            : await User.findOne({username:username});
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other);
    } catch(err) {
        res.status(500).json(err);
    }
});

// Follow User
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const follower = await User.findById(req.body.userID);
            if(!user.followers.includes(req.body.userID)){
                await user.updateOne({$push: {followers: req.body.userID}});
                await follower.updateOne({$push: {following: req.params.id}});
                res.status(200).json("Following!")
            } else {
                return res.status(403).json("You are already following this user.");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only follow other users.");
    }
});

// Unfollow User
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const unfollower = await User.findById(req.body.userID);
            if(user.followers.includes(req.body.userID)){
                await user.updateOne({$pull: {followers: req.body.userID}});
                await unfollower.updateOne({$pull: {following: req.params.id}});
                res.status(200).json("Unfollowed!")
            } else {
                return res.status(403).json("You already unfollowed this user.");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only unfollow other users.");
    }
});

// Get Followings 
router.get("/followings/:userID", async(req,res)=>{
    try {
        const user = await User.findById(req.params.userID);
        const followings = await Promise.all(
            user.following.map(followingID=>{
                return User.findById(followingID)
            })
        );
        let followingList = [];
        followings.map((following)=>{
            const {_id, username, profilePicture} = following;
            followingList.push({_id, username, profilePicture});
        });
        res.status(200).json(followingList);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get All users 
// router.get("/all/get/IDs", async(req,res)=>{
//     try {
//         const userIDs = await User.find().select('_id')
//         // const user = await User.findById(req.params.userID);
//         // const followings = await Promise.all(
//         //     user.following.map(followingID=>{
//         //         return User.findById(followingID)
//         //     })
//         // );
//         // let followingList = [];
//         // followings.map((following)=>{
//         //     const {_id, username, profilePicture} = following;
//         //     followingList.push({_id, username, profilePicture});
//         // });
//         res.status(200).json(userIDs);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })


module.exports = router;
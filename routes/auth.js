const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// DELETE THIS
router.get("/", (req, res)=>{
    res.send("auth route...")
})

// Create User
router.post("/register", async(req, res)=>{
    try {
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPW,
        });    

        // save user and return status
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err)
    }
});

// Usr Login
router.post("/login", async(req, res) =>{
    try {
        const user = await User.findOne({username:req.body.username});
        if(!user) {
            return res.status(404).json("user does not exist");   
        } 
        
        const validPW = await bcrypt.compare(req.body.password, user.password);
        if(!validPW) {
            return res.status(400).json("incorrect password");
        } 

        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router;
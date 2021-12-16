const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:3,
        max:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    name:{
        type:String,
        default:""
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        max:50,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
}, 
    {timestamps:true}, {strict:true}
);

module.exports = mongoose.model("User", UserSchema);
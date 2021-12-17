const mongoose = require("mongoose");

const MarketplaceSchema = new mongoose.Schema({
    userID: {
        type:String,
        required:true
    },
    description:{
        type:String,
        max:500
    },
    image:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
},
    {timestamps:true}
);

module.exports = mongoose.model("Marketplace", MarketplaceSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:'name is required'
    },
    email : {
        type:String,
        required: 'Email is required'
    },
    password:{
        type: String,
        required : 'password is required'
    }
}, {
    timestamps:true,
});
module.exports = mongoose.model("User", userSchema);
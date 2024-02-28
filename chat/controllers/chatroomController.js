const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

exports.createChatroom = async(req,res)=>{
    const {name}=req.body;
    const nameregex = /^[A-Za-z\s]+$/;
    if(!nameregex.test(name)) throw "Chatroom name can only have alphabets";

    const chatroomExist = await Chatroom.findOne({name});
    if(chatroomExist) throw "Chatroom already exist";

    const chatroom = new Chatroom({
        name,
    });

    await chatroom.save();

    res.json({
        message: "Chatroom created",
    });
};

exports.getAllChatrooms = async(req,res)=>{
    const chatrooms = await Chatroom.find({});

    res.json(chatrooms);
}
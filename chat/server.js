require("dotenv").config();
const { isValidObjectId} = require('mongoose');
const Chatroom = require('./models/Chatroom');
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

//bring in all models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");
const app=require('./app');

app.put("/api/chatrooms/:id/updateName", async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    // Find the chatroom by ID and update its name
    // This is a simplified example; make sure to add your own error handling and logic
    if(!isValidObjectId(id)){
      return res.status(400).send({message: "Invalid chatroom ID"});
    }
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) {
      return res.status(404).send({ message: "Chatroom not found" });
    }
    chatroom.name = newName;
    await chatroom.save();

    res.status(200).send({ message: "Chatroom name updated successfully" });
  } catch (error) {
    console.error("Error updating chatroom name:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

const server = app.listen(8000,()=>{
    console.log("Server is listening on port 8000");
});

const io =require("socket.io")(server,
  {
    allowETO3: true,
    cors:{origin: true
       ,methods:[ "GET" ,"POST"],
      Credentials: true
    }
  });
const jwt = require("jwt-then");
const User = require("./models/User");


const Message = mongoose.model("Message");
const user = mongoose.model("User");
io.use(async(socket, next)=>{
  
  try{
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    
    socket.userId = payload.id;
    next();
} catch(err){
  console.log("Socket Authentication Error: ", err.message);
  next(new Error("Authentication Error"));
}
  
});

io.on('connection', (socket)=>{
  console.log("connected "+socket.userId);

  

  socket.on("joinRoom", ({chatroomId})=>{
    socket.join(chatroomId);
    console.log("A user in Chatroom: "+ chatroomId);
  })

  socket.on("leaveRoom", ({chatroomId})=>{
    socket.leave(chatroomId);
    console.log("A user left Chatroom: "+ chatroomId);
  })

  socket.on("chatroomMessage", async({chatroomId, message})=>{
    try{
    if(message.trim().length>0){
      const user = await User.findOne({_id: socket.userId});
      if(!chatroomId){
        throw new Error("Chatroom ID is missing");
      }
      const newMessage = new Message({
        chatroom: chatroomId, 
        user: socket.userId, 
        message});
        await newMessage.save();
    io.to(chatroomId).emit("newMessage",{
      message,
      name: user.name,
      userId: socket.userId,
    });
    
    socket.on('disconnect', ()=>{
      console.log("Disconnected "+ socket.userId);
    })
  }
    }catch{
      console.error("Error saving message");
    }
  })
  
  
})
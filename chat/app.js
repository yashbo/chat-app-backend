const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup cross origin
app.use(require("cors")());

// Bring routers
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));

// Import your Chatroom model
const Chatroom = require("./models/Chatroom"); // Adjust the path based on your file structure

// Route to get chatroom name by ID
app.get("/api/getChatroomNameById/:chatroomId", async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    const chatroom = await Chatroom.findById(chatroomId);

    if (chatroom) {
      res.json({ name: chatroom.name });
    } else {
      res.status(404).json({ error: "Chatroom not found" });
    }
  } catch (error) {
    console.error("Error fetching chatroom name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//api for deleting a chtroom
app.delete("/api/findByIdAndDelete/:chatroomId", async(req,res) => {
  try{
    const chatroomId = req.params.chatroomId;
    await Chatroom.findByIdAndDelete(chatroomId);
    res.json({ message: 'Chatroom deleted successfully' });
} catch (error) {
    console.error('Error deleting chatroom:', error);
    res.status(500).json({ error: 'Internal server error' });
}
  })
// Setup error handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);

if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;

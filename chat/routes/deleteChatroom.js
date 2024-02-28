const express = require('express');
const router = express.Router();
const Chatroom = require('../models/Chatroom');
const auth = require('../middlewares/auth');

router.delete('chatroomId: ', async(req,res)=>{
    try{
        const chatroomId = req.params.chatroomId;
        await Chatroom.findByIdandDelete(chatroomId);I
        res.json({ message: 'Chatroom deleted successfully' });
  } catch (error) {
    console.error('Error deleting chatroom:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

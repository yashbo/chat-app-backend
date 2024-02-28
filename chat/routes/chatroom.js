const router=require("express").Router();
const {catchErrors} = require('../handlers/errorHandlers');
const chatroomController = require('../controllers/chatroomController');

const auth = require("../middlewares/auth");
router.get('/', auth, catchErrors(chatroomController.getAllChatrooms));
router.post('/', auth, catchErrors(chatroomController.createChatroom));
// router.delete('/:chatroomId', async (req, res) => {
//     try {
//       const chatroomId = req.params.chatroomId;
//       const deletedChatroom = await Chatroom.findByIdAndDelete(chatroomId);
//       if (!deletedChatroom) {
//         return res.status(404).json({ error: 'Chatroom not found' });
//       }
//       res.json({ message: 'Chatroom deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting chatroom:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
module.exports = router;
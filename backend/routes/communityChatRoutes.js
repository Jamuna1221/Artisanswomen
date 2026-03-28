const express = require('express');
const router = express.Router();
const { protectSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const chatController = require('../controllers/communityChatController');

router.post('/', protectSeller, upload.single('image'), chatController.createGroup);
router.get('/my', protectSeller, chatController.getMyGroups);
router.get('/search', protectSeller, chatController.searchGroups);

// Message Specific Routes
router.put('/messages/:messageId', protectSeller, chatController.updateMessage);
router.delete('/messages/:messageId', protectSeller, chatController.deleteMessage);

// Group Specific Routes
router.put('/:groupId', protectSeller, upload.single('image'), chatController.updateGroup);
router.delete('/:groupId', protectSeller, chatController.deleteGroup);

router.post('/:groupId/join', protectSeller, chatController.joinGroup);
router.post('/:groupId/leave', protectSeller, chatController.leaveGroup);

router.get('/:groupId/messages', protectSeller, chatController.getMessages);
router.post('/:groupId/messages', protectSeller, upload.any(), chatController.sendMessage);

module.exports = router;

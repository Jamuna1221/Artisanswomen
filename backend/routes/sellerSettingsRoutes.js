const express = require('express');
const router = express.Router();
const { protectSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const sellerSettingsController = require('../controllers/sellerSettingsController');

router.get('/', protectSeller, sellerSettingsController.getSettings);
router.put(
    '/store-profile',
    protectSeller,
    upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
    sellerSettingsController.updateStoreProfile
);
router.put('/account', protectSeller, sellerSettingsController.updateAccount);
router.put('/notifications', protectSeller, sellerSettingsController.updateNotifications);
router.put('/change-password', protectSeller, sellerSettingsController.changePassword);
router.post('/support-ticket', protectSeller, sellerSettingsController.submitSupportTicket);

module.exports = router;

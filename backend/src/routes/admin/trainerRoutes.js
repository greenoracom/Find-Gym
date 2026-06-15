const express = require('express');
const router = express.Router();
const trainerController = require('../../controllers/admin/trainerController');
const platformAdminAuth = require('../../middleware/platformAdminAuth');

router.use(platformAdminAuth);

router.get('/', trainerController.getAllTrainers);
router.get('/:trainerId', trainerController.getTrainerDetails);
router.patch('/:trainerId/approve', trainerController.approveTrainer);
router.patch('/:trainerId/reject', trainerController.rejectTrainer);
router.patch('/:trainerId/block', trainerController.blockTrainer);
router.patch('/:trainerId/unblock', trainerController.unblockTrainer);
router.delete('/:trainerId', trainerController.deleteTrainer);

module.exports = router;

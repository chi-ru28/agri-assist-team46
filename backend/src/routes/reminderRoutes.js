const express = require('express');
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(auth);
router.use(authorize('farmer'));

router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.patch('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;

const express = require('express');
const router = express.Router();
const NotificationService = require('../utils/notificationService');
const { isAuthenticated } = require('../middleware/googleAuth');

// Send notification for event creation
router.post('/event-created', isAuthenticated, async (req, res) => {
    try {
        const { user, event } = req.body;
        await NotificationService.sendEventNotification(user, event, 'Created');
        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error: error.message });
    }
});

// Send notification for event update
router.post('/event-updated', isAuthenticated, async (req, res) => {
    try {
        const { user, event } = req.body;
        await NotificationService.sendEventNotification(user, event, 'Updated');
        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error: error.message });
    }
});

// Send notification for event reminder
router.post('/event-reminder', isAuthenticated, async (req, res) => {
    try {
        const { user, event } = req.body;
        await NotificationService.sendEventNotification(user, event, 'Reminder');
        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error: error.message });
    }
});

// Send custom notification
router.post('/custom', isAuthenticated, async (req, res) => {
    try {
        const { user, subject, message } = req.body;
        const notifications = [];

        if (user.email) {
            notifications.push(
                NotificationService.sendEmail(user.email, subject, message)
            );
        }

        if (user.phone) {
            notifications.push(
                NotificationService.sendSMS(user.phone, message)
            );
        }

        if (user.whatsapp) {
            notifications.push(
                NotificationService.sendWhatsApp(user.whatsapp, message)
            );
        }

        await Promise.all(notifications);
        res.json({ message: 'Custom notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error: error.message });
    }
});

module.exports = router; 
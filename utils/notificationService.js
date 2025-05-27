const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('../config/services');

// Initialize email transporter
const emailTransporter = nodemailer.createTransport(config.email);

// Initialize Twilio client
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

// Initialize WhatsApp client
const whatsappClient = new Client({
    authStrategy: 'local',
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// WhatsApp QR code generation
whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

whatsappClient.initialize();

class NotificationService {
    // Send email notification
    static async sendEmail(to, subject, text, html) {
        try {
            const mailOptions = {
                from: config.email.auth.user,
                to,
                subject,
                text,
                html
            };
            await emailTransporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    // Send SMS notification
    static async sendSMS(to, message) {
        try {
            await twilioClient.messages.create({
                body: message,
                to,
                from: config.twilio.phoneNumber
            });
            return true;
        } catch (error) {
            console.error('SMS sending failed:', error);
            return false;
        }
    }

    // Send WhatsApp notification
    static async sendWhatsApp(to, message) {
        try {
            const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
            await whatsappClient.sendMessage(chatId, message);
            return true;
        } catch (error) {
            console.error('WhatsApp message sending failed:', error);
            return false;
        }
    }

    // Send event notification through all channels
    static async sendEventNotification(user, event, notificationType) {
        const { email, phone, whatsapp } = user;
        const eventDetails = `
            Event: ${event.title}
            Date: ${event.date}
            Time: ${event.time}
            Location: ${event.location}
            Description: ${event.description}
        `;

        const notifications = [];

        if (email) {
            notifications.push(
                this.sendEmail(
                    email,
                    `Event ${notificationType}: ${event.title}`,
                    eventDetails,
                    `<h1>${event.title}</h1><p>${eventDetails}</p>`
                )
            );
        }

        if (phone) {
            notifications.push(
                this.sendSMS(phone, `Event ${notificationType}: ${eventDetails}`)
            );
        }

        if (whatsapp) {
            notifications.push(
                this.sendWhatsApp(whatsapp, `Event ${notificationType}: ${eventDetails}`)
            );
        }

        return Promise.all(notifications);
    }
}

module.exports = NotificationService; 
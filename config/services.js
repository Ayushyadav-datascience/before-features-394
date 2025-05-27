require('dotenv').config();

module.exports = {
    // Email Configuration
    email: {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    },

    // Twilio Configuration for SMS
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },

    // WhatsApp Configuration
    whatsapp: {
        clientId: process.env.WHATSAPP_CLIENT_ID,
        clientSecret: process.env.WHATSAPP_CLIENT_SECRET
    },

    // Google Maps Configuration
    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
    },

    // Google OAuth Configuration
    googleAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }
}; 
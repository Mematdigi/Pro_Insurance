require('dotenv').config();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Ensure this is set in your .env file
const client = twilio(accountSid, authToken);

const sendSms = async (phone, message) => {
  try {
   const response = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phone,                // Custom message
    });
    return true;
 
  } catch (e) {
    console.log(e);
    return false; // Return false if sending fails
  }
};

const sendWhatsAppMessage = async (phone, message) => {
  try {
   const response = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`, // Twilio Sandbox WhatsApp number
      to: `whatsapp:${phone}`,          // Recipient's WhatsApp number (with country code)
      body: message                  // Custom message
    });
    return true;
  } catch (e) {
    console.log(e);
    return false; // Return false if sending fails
  }
};


module.exports = { sendSms , sendWhatsAppMessage };

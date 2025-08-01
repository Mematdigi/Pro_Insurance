require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const sendSms = (phone, message) => {
  try {
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: message,
        from: twilioPhoneNumber,
        to: phone,
      })
      .then((res) => console.log("message sent sucessfully"));
  } catch (e) {
    console.log(e);
  }
};

const sendWhatsAppMessage = (phone, message) => {
  try {
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: message,
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${phone}`,
      })
      .then((res) => console.log("WhatsApp message sent successfully"));
  } catch (e) {
    console.log(e);
  }
};


module.exports = { sendSms , sendWhatsAppMessage };

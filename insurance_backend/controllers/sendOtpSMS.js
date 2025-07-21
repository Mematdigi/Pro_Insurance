const axios = require('axios');
const User = require('./models/User');

async function sendOtpSMS(contactNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 min

  const user = await User.findOne({ contactNumber });
  if (!user) {
    console.log('❌ Contact number not registered');
    return;
  }

  user.otp = otp;
  user.otpExpires = expiry;
  await user.save();

  const message = `Your OTP is ${otp}. Valid for 5 minutes.`;

  const fast2smsPayload = {
    sender_id: 'FSTSMS',
    message,
    language: 'english',
    route: 'qt', // or 'p' for promotional
    numbers: contactNumber,
  };

  try {
    const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', fast2smsPayload, {
      headers: {
        authorization: 'YOUR_FAST2SMS_API_KEY',
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ OTP sent to ${contactNumber}`);
  } catch (err) {
    console.error('❌ Error sending SMS:', err.response.data);
  }
}

module.exports = sendOtpSMS;

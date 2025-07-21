const readline = require('readline');
const User = require('./models/User');
require('./db');

function ask(q) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function otpLoginSMS() {
  const contactNumber = await ask('Enter your contact number: ');
  const user = await User.findOne({ contactNumber });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  await require('./sendOtpSMS')(contactNumber);

  const inputOtp = await ask('Enter OTP sent via SMS: ');
  const now = new Date();

  if (user.otp === inputOtp && user.otpExpires > now) {
    console.log(`✅ Welcome, ${user.name || user.contactNumber}`);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
  } else {
    console.log('❌ Invalid or expired OTP');
  }
}

otpLoginSMS();

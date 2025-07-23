const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');
require('./jobs/notificationScheduler')

const app = express();
app.use(cors({
  origin: 'http://localhost:5174', // Adjust this to your frontend URL
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/*
// --- Google OAuth Routes ---
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
    successRedirect: '/dashboard'
  })
);

app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.send(`<h2>Welcome, ${req.user.name || req.user.email}</h2>`);
});

app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/login-failed', (req, res) => {
  res.send('❌ Login Failed');
});
*/

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const policyRoute = require('./routes/policyRoute');
app.use('/api', policyRoute);

const agentRoutes = require('./routes/agentRoutes');
app.use('/api/agent', agentRoutes);

/*
const scheduleNotifications = require('./jobs/notificationScheduler');
scheduleNotifications(); // ⏰ Start the cron job

const notificationRoute = require('./routes/notificationRoute');
app.use('/api/notifications', notificationRoute);
*/
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

const familyRoutes = require("./routes/familyRoutes");
app.use("/api/family", familyRoutes);
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));

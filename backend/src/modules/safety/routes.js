const express = require('express');
const router = express.Router();

router.post('/verify-pickup', (req, res) => {
  const { childId, otp } = req.body;
  if (!childId || !otp) return res.status(400).json({ error: 'childId and otp required' });
  return res.json({ childId, verified: otp.length >= 4, method: 'OTP' });
});

router.post('/emergency', (req, res) => {
  const { tripId, driverId, note } = req.body;
  return res.status(202).json({ alert: 'EMERGENCY_ALERT_CREATED', tripId, driverId, note });
});

module.exports = { router };

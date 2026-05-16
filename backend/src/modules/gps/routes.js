const express = require('express');
const router = express.Router();

router.post('/update', (req, res) => {
  const { tripId, latitude, longitude, speed, timestamp } = req.body;
  if (![tripId, latitude, longitude, timestamp].every(Boolean)) return res.status(400).json({ error: 'Missing fields' });
  const deviation = speed > 80;
  return res.json({ accepted: true, tripId, deviation, speed });
});

module.exports = { router };

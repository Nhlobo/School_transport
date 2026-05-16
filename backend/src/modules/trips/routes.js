const express = require('express');
const router = express.Router();

const TRIP_STATES = ['PENDING', 'STARTED', 'PICKING_UP', 'ON_ROUTE', 'ARRIVED_AT_SCHOOL', 'COMPLETED'];

router.post('/:id/start', (req, res) => res.json({ tripId: req.params.id, status: 'STARTED', at: new Date().toISOString() }));
router.post('/:id/transition', (req, res) => {
  const { status } = req.body;
  if (!TRIP_STATES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  return res.json({ tripId: req.params.id, status, at: new Date().toISOString() });
});

module.exports = { router, TRIP_STATES };

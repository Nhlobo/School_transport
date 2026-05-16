const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { router: tripRouter } = require('./modules/trips/routes');
const { router: gpsRouter } = require('./modules/gps/routes');
const { router: safetyRouter } = require('./modules/safety/routes');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'msos-api' }));
app.use('/api/trips', tripRouter);
app.use('/api/gps', gpsRouter);
app.use('/api/safety', safetyRouter);

module.exports = { app };

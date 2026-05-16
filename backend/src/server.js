const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('driver_location_update', (payload) => io.emit('driver_location_update', payload));
  socket.on('trip_status_update', (payload) => io.emit('trip_status_update', payload));
  socket.on('child_picked_up', (payload) => io.emit('child_picked_up', payload));
  socket.on('child_dropped_off', (payload) => io.emit('child_dropped_off', payload));
  socket.on('emergency_alert', (payload) => io.emit('emergency_alert', payload));
  socket.on('delay_warning', (payload) => io.emit('delay_warning', payload));
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`MSOS API listening on ${port}`));

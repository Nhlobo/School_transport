CREATE TABLE users (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('parent', 'driver')),
  full_name TEXT NOT NULL,
  south_african_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL UNIQUE,
  pdp_license_number TEXT,
  password_hash TEXT NOT NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_hash TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE login_attempts (
  id UUID PRIMARY KEY,
  south_african_id TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE children (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  school_id UUID,
  route_id UUID,
  pickup_point TEXT NOT NULL,
  seat_number INT NOT NULL
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  pdp_verified BOOLEAN NOT NULL DEFAULT FALSE,
  phone TEXT NOT NULL UNIQUE,
  vehicle_id UUID
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  model TEXT NOT NULL DEFAULT 'Toyota Avanza',
  plate_number TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 7,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE routes (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL
);

CREATE TABLE route_stops (
  id UUID PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id),
  name TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  order_index INT NOT NULL
);

CREATE TABLE trips (
  id UUID PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  status TEXT NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP
);

CREATE TABLE location_logs (
  id UUID PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id),
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  speed NUMERIC(5, 2),
  timestamp TIMESTAMP NOT NULL
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL,
  due_date DATE NOT NULL,
  month TEXT NOT NULL
);

CREATE TABLE safety_logs (
  id UUID PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id),
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

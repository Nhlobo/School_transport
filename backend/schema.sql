CREATE TABLE users (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('parent', 'driver', 'owner')),
  status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('PENDING','VERIFIED','REJECTED','SUSPENDED')),
  full_name TEXT NOT NULL,
  south_african_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL UNIQUE,
  pdp_license_number TEXT,
  password_hash TEXT NOT NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE driver_verifications (
  id UUID PRIMARY KEY,
  driver_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  pdp_number TEXT NOT NULL,
  vehicle_registration TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('PENDING','VERIFIED','REJECTED','SUSPENDED')),
  verified_by_owner UUID REFERENCES users(id),
  verified_at TIMESTAMP
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

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  device_fingerprint TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

BEGIN;

-- Drones table
CREATE TABLE IF NOT EXISTS drones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    model VARCHAR(20) NOT NULL CHECK (model IN ('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight')),
    weight_limit DECIMAL(5,2) NOT NULL CHECK (weight_limit > 0 AND weight_limit <= 500),
    battery_capacity INTEGER NOT NULL CHECK (battery_capacity >= 0 AND battery_capacity <= 100),
    state VARCHAR(20) NOT NULL DEFAULT 'IDLE' CHECK (state IN ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_drones_state ON drones(state);
CREATE INDEX IF NOT EXISTS idx_drones_battery ON drones(battery_capacity);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
    code VARCHAR(100) NOT NULL UNIQUE,
    image VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Drone Delivery Sessions
CREATE TABLE IF NOT EXISTS drone_delivery_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drone_id UUID NOT NULL REFERENCES drones(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_drone_delivery_sessions_drone_id ON drone_delivery_sessions(drone_id);

-- Drone Medical Loads
CREATE TABLE IF NOT EXISTS drone_medication_loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES drone_delivery_sessions(id) ON DELETE CASCADE,
    drone_id UUID NOT NULL REFERENCES drones(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    loaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drone_medication_loads_session_id ON drone_medication_loads(session_id);
CREATE INDEX IF NOT EXISTS idx_drone_medication_loads_session_id ON drone_medication_loads(session_id);

-- Battery audit table
CREATE TABLE IF NOT EXISTS battery_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drone_id UUID NOT NULL REFERENCES drones(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL,
    battery_capacity INTEGER NOT NULL CHECK (battery_capacity >= 0 AND battery_capacity <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_battery_audit_drone_id ON battery_audit(drone_id);
CREATE INDEX IF NOT EXISTS idx_battery_audit_serial_number ON battery_audit(serial_number);
CREATE INDEX IF NOT EXISTS idx_battery_audit_created_at ON battery_audit(created_at DESC);

COMMIT;

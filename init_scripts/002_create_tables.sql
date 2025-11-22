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

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
    code VARCHAR(100) NOT NULL UNIQUE,
    image VARCHAR(500),
    drone_id UUID REFERENCES drones(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Battery audit table
CREATE TABLE IF NOT EXISTS battery_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drone_id UUID NOT NULL REFERENCES drones(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL,
    battery_capacity INTEGER NOT NULL CHECK (battery_capacity >= 0 AND battery_capacity <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drones_state ON drones(state);
CREATE INDEX IF NOT EXISTS idx_drones_battery ON drones(battery_capacity);
CREATE INDEX IF NOT EXISTS idx_medications_drone_id ON medications(drone_id);
CREATE INDEX IF NOT EXISTS idx_battery_audit_drone_id ON battery_audit(drone_id);
CREATE INDEX IF NOT EXISTS idx_battery_audit_created_at ON battery_audit(created_at DESC);

COMMIT;

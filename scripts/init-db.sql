-- Database initialization script for Helfy
-- This runs when the PostgreSQL container starts for the first time

-- Create the main application database
CREATE DATABASE helfy_app;

-- Switch to the main application database
\c helfy_app;

-- Enable the TimescaleDB extension (available for future use)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE '✅ Helfy database initialized successfully';
END $$;
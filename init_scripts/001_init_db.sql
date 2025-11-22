-- init-scripts/001_init_db.sql

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'bluser') THEN
        CREATE USER bluser WITH PASSWORD 'secret';
        -- Log success
        RAISE NOTICE 'Created user: bluser';
    END IF;
END
$$;

-- Grant database creation privileges
ALTER USER bluser CREATEDB;

-- Grant connection privileges
GRANT CONNECT ON DATABASE bludrone TO bluser;

-- Connect to the database
\c bludrone

-- Grant schema privileges (run after connecting to database)
GRANT ALL ON SCHEMA public TO bluser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bluser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bluser;

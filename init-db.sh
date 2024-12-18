#!/bin/bash
set -e

# Create the database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB') THEN
      CREATE DATABASE "$POSTGRES_DB"
        WITH 
        OWNER = postgres
        ENCODING = 'UTF8';
    END IF;
  END
  \$\$;
EOSQL

# Create tenant user if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = '$POSTGRES_TENANT_USER') THEN
      CREATE USER $POSTGRES_TENANT_USER WITH PASSWORD '$POSTGRES_TENANT_PASSWORD';
    END IF;
  END
  \$\$;

  GRANT CONNECT ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_TENANT_USER";
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "$POSTGRES_TENANT_USER";
  GRANT USAGE ON SCHEMA public TO "$POSTGRES_TENANT_USER";
EOSQL

echo "Database setup complete"

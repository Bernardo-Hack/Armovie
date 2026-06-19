#!/bin/bash
# Cria múltiplos bancos de dados no PostgreSQL ao inicializar o container.
# O nome dos bancos é lido da variável POSTGRES_MULTIPLE_DATABASES (separados por vírgula).
set -e

function create_db() {
  local db=$1
  echo "  Creating database '$db'..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "$db";
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Multiple databases requested: $POSTGRES_MULTIPLE_DATABASES"
  for db in $(echo "$POSTGRES_MULTIPLE_DATABASES" | tr ',' ' '); do
    create_db "$db"
  done
  echo "Multiple databases created."
fi

#!/bin/bash

# Lê o arquivo SQL
SQL_CONTENT=$(cat supabase/migrations/00001_initial_schema.sql)

# Executa a migração via API
curl -X POST 'https://uasnyifizdjxogowijip.supabase.co/rest/v1/rpc/exec_sql' \
  -H "apikey: sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0" \
  -H "Authorization: Bearer sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$SQL_CONTENT\"}" 
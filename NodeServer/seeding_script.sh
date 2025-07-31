#!/bin/bash

URL="http://140.245.5.226:3000/api/v1/incident/new-incident"

declare -a payloads=(
'{
  "title": "Oracle RMAN backup failed",
  "description": "Scheduled RMAN backup failed with ORA-19809 because flash recovery area was full.",
  "issuedBy": "user1@kpmg.com",
  "symptoms": ["ORA-19809", "RMAN-03009", "Flash recovery full"]
}'
'{
  "title": "RMAN job failed due to space",
  "description": "RMAN couldn’t run due to lack of space in FRA. ORA-19809 and RMAN-03009 errors reported.",
  "issuedBy": "user2@kpmg.com",
  "symptoms": ["ORA-19809: limit exceeded", "RMAN-03009", "Flash area full"]
}'
'{
  "title": "TNS_ADMIN not set",
  "description": "Listener failed to start because TNS_ADMIN environment variable was not defined.",
  "issuedBy": "user3@kpmg.com",
  "symptoms": ["TNS-12541", "TNS:no listener", "TNS_ADMIN unset"]
}'
'{
  "title": "Listener startup error",
  "description": "Oracle listener unable to start. Missing TNS_ADMIN caused connection issues.",
  "issuedBy": "user4@kpmg.com",
  "symptoms": ["TNS-12541", "No listener", "Env var TNS_ADMIN missing"]
}'
'{
  "title": "CPU spikes due to query",
  "description": "Oracle DB uses full table scan in queries, spiking CPU on production node.",
  "issuedBy": "user5@kpmg.com",
  "symptoms": ["Full table scan", "High CPU usage", "AWR reports bottleneck"]
}'
'{
  "title": "ORA-01653 error",
  "description": "Crash due to datafile reaching max size; autoextend was disabled.",
  "issuedBy": "user6@kpmg.com",
  "symptoms": ["ORA-01653", "Datafile maxed", "No autoextend"]
}'
'{
  "title": "Snapshot too old",
  "description": "Query failed with ORA-01555 due to undo retention being too low during backup.",
  "issuedBy": "user7@kpmg.com",
  "symptoms": ["ORA-01555", "Undo insufficient", "Long query failure"]
}'
'{
  "title": "Archive log error",
  "description": "Database hang due to archive log destination being full, backups delayed.",
  "issuedBy": "user8@kpmg.com",
  "symptoms": ["ORA-00257", "Archive full", "Hang state"]
}'
'{
  "title": "Password expired",
  "description": "Login failed due to ORA-28001 error — password expired.",
  "issuedBy": "user9@kpmg.com",
  "symptoms": ["ORA-28001", "User lock", "SQLPlus access denied"]
}'
'{
  "title": "Database startup in progress",
  "description": "Users unable to connect during startup window. ORA-01033 reported.",
  "issuedBy": "user10@kpmg.com",
  "symptoms": ["ORA-01033", "Startup in progress"]
}'
'{
  "title": "Listener unknown service",
  "description": "Client failed to connect due to TNS-12514 — unknown service name.",
  "issuedBy": "user11@kpmg.com",
  "symptoms": ["ORA-12514", "Service not registered"]
}'
'{
  "title": "RMAN slow backups",
  "description": "Night RMAN backups exceeding time window; I/O bottlenecks observed.",
  "issuedBy": "user12@kpmg.com",
  "symptoms": ["Night RMAN backups exceeding time window; I/O bottlenecks observed.", "High I/O waits"]
}'
)

# Repeat payloads to increase count (4x = ~48 incidents)
echo "🚀 Seeding incidents into system..."
for i in {1..4}; do
  echo "🔁 Round $i..."
  for idx in "${!payloads[@]}"; do
    echo "📨 Sending Incident $((idx + 1))..."
    curl -s -X POST "$URL" -H "Content-Type: application/json" -d "${payloads[$idx]}" \
      | jq '.message, .incidentId, .similarIncidents[]?._id' 2>/dev/null
    sleep 0.5
  done
done

echo "✅ Seeding complete: $((${#payloads[@]} * 4)) incidents submitted."

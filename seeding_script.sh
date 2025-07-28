#!/bin/bash

URL="http://localhost:3000/api/v1/incident/new-incident"

payloads=(
'{
  "title": "Oracle RMAN backup failed",
  "description": "The scheduled RMAN backup failed with error ORA-19809. It seems the flash recovery area is full.",
  "issuedBy": "user1@kpmg.com",
  "symptoms": ["ORA-19809: limit exceeded for recovery files", "RMAN-03009: failure of backup command"]
}'
'{
  "title": "Listener not starting",
  "description": "Oracle listener fails to start due to missing TNS_ADMIN variable.",
  "issuedBy": "user2@kpmg.com",
  "symptoms": ["TNS-12541: TNS:no listener", "Environment variable TNS_ADMIN not set"]
}'
'{
  "title": "High CPU usage by Oracle DB",
  "description": "The database server is experiencing high CPU due to a full table scan in production queries.",
  "issuedBy": "user3@kpmg.com",
  "symptoms": ["Query using full table scan", "High CPU shown in AWR report"]
}'
'{
  "title": "Datafile autoextend not enabled",
  "description": "Database crashed due to datafile reaching max size and autoextend being disabled.",
  "issuedBy": "user4@kpmg.com",
  "symptoms": ["ORA-01653: unable to extend table", "Datafile maxed out"]
}'
'{
  "title": "ORA-01555 Snapshot too old error",
  "description": "Long-running queries are throwing snapshot too old error during backup window.",
  "issuedBy": "user5@kpmg.com",
  "symptoms": ["ORA-01555: snapshot too old", "Undo retention not sufficient"]
}'
'{
  "title": "Archive log full",
  "description": "Archive destination is full and no backups have been taken, database stuck in hang state.",
  "issuedBy": "user6@kpmg.com",
  "symptoms": ["ORA-00257: archiver error", "Archive destination full"]
}'
'{
  "title": "ORA-28001: Password expired",
  "description": "User unable to login due to expired password in Oracle DB.",
  "issuedBy": "user7@kpmg.com",
  "symptoms": ["ORA-28001: the password has expired", "User cannot connect using SQL*Plus"]
}'
'{
  "title": "ORA-01033: Oracle startup in progress",
  "description": "User connection fails during database startup sequence.",
  "issuedBy": "user8@kpmg.com",
  "symptoms": ["ORA-01033: ORACLE initialization or shutdown in progress"]
}'
'{
  "title": "ORA-12514 TNS listener does not know service",
  "description": "Client fails to connect due to listener not recognizing the requested service.",
  "issuedBy": "user9@kpmg.com",
  "symptoms": ["ORA-12514: TNS listener does not know of service requested in connect descriptor"]
}'
'{
  "title": "RMAN backup taking long time",
  "description": "Nightly RMAN backups exceed backup window consistently due to I/O bottlenecks.",
  "issuedBy": "user10@kpmg.com",
  "symptoms": ["RMAN taking over 6 hours", "I/O wait spikes in VM metrics"]
}'
)

# Repeat payloads to reach ~40 submissions
for i in {1..4}; do
  for payload in "${payloads[@]}"; do
    echo "Sending Incident $i..."
    curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$payload" > /dev/null
  done
done

echo "✅ Seeding complete: $((${#payloads[@]} * 4)) incidents submitted."

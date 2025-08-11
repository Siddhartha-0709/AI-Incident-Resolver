#!/bin/bash

API_URL="https://proxy-route-eta.vercel.app/api/new-incident"
ISSUED_BY="6892f098835a909a15d9a6ad"

# Array of incident payloads (JSON strings)
payloads=(
  # DevOps incidents
  '{"title":"Docker Container CrashLoopBackOff","description":"Application container keeps restarting due to missing environment variable.","issuedBy":"'$ISSUED_BY'","symptoms":["CrashLoopBackOff","Container restart count increasing","Missing ENV var"],"errorCode":"N/A"}'
  '{"title":"Kubernetes Pod Pending State","description":"Pod stuck in Pending state due to insufficient node resources.","issuedBy":"'$ISSUED_BY'","symptoms":["Pod Pending","Insufficient CPU","Unschedulable"],"errorCode":"N/A"}'
  '{"title":"Jenkins Pipeline Timeout","description":"Build pipeline exceeds execution time during Maven build stage.","issuedBy":"'$ISSUED_BY'","symptoms":["Timeout in Jenkins","Maven build stuck","High CPU usage"],"errorCode":"N/A"}'
  '{"title":"Terraform Apply Failure","description":"Terraform apply fails due to resource already existing in cloud.","issuedBy":"'$ISSUED_BY'","symptoms":["ResourceExists error","Terraform plan mismatch"],"errorCode":"N/A"}'
  '{"title":"Helm Chart Deployment Error","description":"Helm deployment fails due to missing values.yaml entry.","issuedBy":"'$ISSUED_BY'","symptoms":["Helm install failed","Missing key in values.yaml"],"errorCode":"N/A"}'

  # Oracle DBA incidents
  '{"title":"ORA-12560: TNS Protocol Adapter Error","description":"Database client unable to connect due to incorrect ORACLE_HOME setting.","issuedBy":"'$ISSUED_BY'","symptoms":["ORA-12560","SQLPlus connection failure"],"errorCode":"ORA-12560"}'
  '{"title":"RMAN-03002 Backup Failure","description":"RMAN backup job fails during archivelog backup stage.","issuedBy":"'$ISSUED_BY'","symptoms":["RMAN-03002","Archivelog backup incomplete"],"errorCode":"RMAN-03002"}'
  '{"title":"High Wait Events in AWR","description":"AWR report shows high db file sequential read wait events.","issuedBy":"'$ISSUED_BY'","symptoms":["High db file sequential read","Slow query performance"],"errorCode":"N/A"}'
  '{"title":"ORA-01652: Unable to Extend Temp Segment","description":"Sort operations fail due to temp tablespace full.","issuedBy":"'$ISSUED_BY'","symptoms":["ORA-01652","Sort failed","Temp tablespace full"],"errorCode":"ORA-01652"}'
  '{"title":"Listener Startup Error","description":"Listener fails to start due to invalid parameter in listener.ora.","issuedBy":"'$ISSUED_BY'","symptoms":["TNS-01151","Listener failed to start"],"errorCode":"TNS-01151"}'
)

# Loop through payloads and POST each one
for payload in "${payloads[@]}"; do
  echo "Creating incident: $(echo $payload | jq -r .title)"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$payload"
  echo -e "\n---"
done

echo "✅ Seeding complete!"

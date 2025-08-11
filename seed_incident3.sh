#!/bin/bash

API_URL="https://proxy-route-eta.vercel.app/api/new-incident"
ISSUED_BY="689343ba451aa6762f2fa9a2"

# Array of JSON payloads (escaped properly for bash)
payloads=(
'{"title":"Docker container stuck in restarting state","description":"Containers keep restarting after deployment in Kubernetes.","issuedBy":"'"$ISSUED_BY"'","symptoms":["CrashLoopBackOff in pod status","Error: exit code 137 in logs"]}'
'{"title":"Jenkins job fails after upgrading pipeline plugins","description":"After upgrading Jenkins pipeline plugins, the job fails with undefined method error.","issuedBy":"'"$ISSUED_BY"'","symptoms":["NoSuchMethodError in pipeline","Pipeline aborts before execution"]}'
'{"title":"Kubernetes pod cannot pull image from private registry","description":"ImagePullBackOff when pulling images from ECR.","issuedBy":"'"$ISSUED_BY"'","symptoms":["ImagePullBackOff","403 Forbidden from registry"]}'
'{"title":"Helm upgrade fails with tiller error","description":"Helm upgrade fails due to release history corruption.","issuedBy":"'"$ISSUED_BY"'","symptoms":["Helm status shows pending-upgrade","Error: release XXX failed"]}'
'{"title":"Terraform plan fails for AWS ECS service","description":"Terraform apply fails due to missing IAM policy.","issuedBy":"'"$ISSUED_BY"'","symptoms":["AccessDeniedException from AWS","terraform apply fails"]}'

'{"title":"ORA-01555 snapshot too old error","description":"Long-running query fails with snapshot too old in Oracle 19c.","issuedBy":"'"$ISSUED_BY"'","symptoms":["ORA-01555 in alert log","Query aborts halfway"]}'
'{"title":"Oracle RAC node eviction","description":"One of the RAC nodes got evicted due to network heartbeat issue.","issuedBy":"'"$ISSUED_BY"'","symptoms":["CSSD evicting node","Interconnect packet loss"]}'
'{"title":"RMAN restore fails with ORA-19870","description":"RMAN restore from tape fails due to block corruption.","issuedBy":"'"$ISSUED_BY"'","symptoms":["ORA-19870","RMAN-03002"]}'
'{"title":"Database listener not starting after patching","description":"After applying PSU patch, listener refuses to start.","issuedBy":"'"$ISSUED_BY"'","symptoms":["TNS-12560","Listener.log missing entries"]}'
'{"title":"AWR reports show high db file sequential read","description":"Performance degradation due to slow index access.","issuedBy":"'"$ISSUED_BY"'","symptoms":["High db file sequential read","Slow application queries"]}'
)

for payload in "${payloads[@]}"; do
  echo "Posting incident: $(echo "$payload" | jq -r .title)"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$payload"
  echo -e "\n---"
done

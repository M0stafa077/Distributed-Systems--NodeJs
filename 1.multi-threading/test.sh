#!/bin/bash

oldPID=""

getServerPID() {
    curl -s localhost:5000 | jq -r '.pid'
}

oldPID=$(getServerPID)

# Loop to check for PID changes
while true; do
    newPID=$(getServerPID)
    if [ "$newPID" != "$oldPID" ]; then
        echo "PID has changed from $oldPID to $newPID"
        oldPID=$newPID
    fi
    sleep 1
done

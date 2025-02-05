#!/bin/bash

counter_1=0
counter_2=0


while true; do
	counter_1=$((counter_1 + 1))
	counter_2=$((counter_2 + 1))

	if [ ${counter_1} -eq 5 ]; then
		counter_1=0
		curl http://localhost:8000 | jq .
	fi


	if [ ${counter_2} -eq 10 ]; then
                counter_2=0
                curl http://localhost:8000/error | jq .
        fi

	sleep 1
done

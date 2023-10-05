#!/bin/bash

set -ea

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$ibex_process" 2>/dev/null
}

trap _term SIGTERM

echo "Starting Container..."

npm run start-ibex &

ibex_process=$!
wait $ibex_process

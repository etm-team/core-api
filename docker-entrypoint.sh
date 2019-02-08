#!/bin/bash

set -e
if [ "$1" = 'etm-api' ]; then
  exec node /var/service/dist/index.js "$@"
fi

exec "$@"

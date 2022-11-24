#!/bin/bash
set -Eeu

trap 'Error on line $LINENO' ERR

CMD="yarn start:dev"

if [ -n "${WAIT_FOR}" ]; then
  wait-for-it ${WAIT_FOR} -s -t ${WAIT_FOR_TIMEOUT} -- ${CMD}
fi

# shellcheck disable=SC2086
exec "$@"

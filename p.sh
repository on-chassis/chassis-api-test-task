#!/bin/bash
set -Eeu

docker exec -it chassis-api-test-task_postgres_1 psql postgres://postgres@localhost:5432/testtask

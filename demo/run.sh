#!/usr/bin/env bash

cd `dirname $0`/../

node src/server/dist/index.js run -c demo/build-tracker.config.js

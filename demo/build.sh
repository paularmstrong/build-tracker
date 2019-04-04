#!/usr/bin/env bash

cd `dirname $0`/../

node src/server/dist/index.js setup -c demo/build-tracker.config.js

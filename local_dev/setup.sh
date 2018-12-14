#!/bin/sh

npm install

echo !!! By default Endpoints updates and source registration steps are skipped
echo !!! Please remove default values of endpoints and a collector ID to test these steps.

ROOT=$(dirname $0)
DEV_CONFIG=${ROOT}/dev_config.js
DEV_CONFIG_TMPL=${ROOT}/dev_config.js.tmpl

if [ ! -f $DEV_CONFIG ]; then
    cp ${DEV_CONFIG_TMPL} ${DEV_CONFIG}
fi

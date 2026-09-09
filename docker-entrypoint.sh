#!/bin/sh

set -e

sed -i "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/config.js
sed -i "s|__USE_I_RADIO_PREFIX__|${USE_I_RADIO_PREFIX}|g" /usr/share/nginx/html/config.js

exec "$@"

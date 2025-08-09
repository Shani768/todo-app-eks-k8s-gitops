#!/bin/sh

# Generate env.js
echo "window.env = {
  VITE_API_URL: \"$VITE_API_URL\"
}" > /usr/share/nginx/html/env.js

# Generate nginx.conf from template
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec "$@"

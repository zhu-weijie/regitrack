#!/bin/sh

# Wait for the API service to be available on port 3000
# 'nc' (netcat) is a utility available in the alpine image
until nc -z api 3000; do
  echo "Waiting for the API service..."
  sleep 2
done

echo "API service is up, starting Nginx."
# Execute the original Nginx command
nginx -g 'daemon off;'

#!/bin/bash

# Khởi động Docker daemon ở chế độ nền
dockerd &

until docker info >/dev/null 2>&1; do
  echo -n "."
  sleep 1
done

# Giữ container hoạt động
exec "$@"
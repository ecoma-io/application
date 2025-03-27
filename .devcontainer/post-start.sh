#!/bin/sh

set -e
set -x

LOG_FILE="/tmp/postStartDebug.log"

echo "🛠️  Starting postStartCommand debug..." | tee -a "$LOG_FILE"

{
    echo "📌 Deploy local..."
    docker compose up -d --wait --progress=plain
    echo "✅ Docker Compose started successfully."
} 2>&1 | tee -a "$LOG_FILE"

echo "🎉 postStartCommand completed successfully!" | tee -a "$LOG_FILE"

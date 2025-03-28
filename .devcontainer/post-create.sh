#!/bin/sh

set -e
set -x

LOG_FILE="/tmp/postCreateDebug.log"

echo "🛠️  Starting postCreateCommand debug..." | tee -a "$LOG_FILE"


{
    echo "📌 Running npm install -g nx..."
    npm install -g nx
    echo "✅ npm install -g nx done."

    echo "📌 Running yarn install..."
    yarn install
    echo "✅ yarn install done."

    echo "📌 Running playwright install..."
    npx playwright install --with-deps
    echo "✅ yarn install done."

    echo "📌 Running nx run-many -t build..."
    nx run-many -t build
    echo "✅ nx build done."

    echo "📌 Running docker compose up -d --wait..."
    docker compose up -d --wait --progress=plain
    echo "✅ Docker Compose started successfully."
} 2>&1 | tee -a "$LOG_FILE"

echo "🎉 postCreateCommand completed successfully!" | tee -a "$LOG_FILE"

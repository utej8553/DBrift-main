#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"

echo "🛑 Stopping DBRift demo..."

# ---------------- BACKEND ----------------
if [ -f "$PID_DIR/backend.pid" ]; then
  kill "$(cat "$PID_DIR/backend.pid")" && echo "✅ Backend stopped"
  rm "$PID_DIR/backend.pid"
else
  echo "⚠️ Backend PID not found"
fi

# ---------------- FRONTEND ----------------
if [ -f "$PID_DIR/frontend.pid" ]; then
  kill "$(cat "$PID_DIR/frontend.pid")" && echo "✅ Frontend stopped"
  rm "$PID_DIR/frontend.pid"
else
  echo "⚠️ Frontend PID not found"
fi

# ---------------- DOCKER CLEANUP ----------------
echo "🐳 Cleaning DBRift Docker containers..."

# OPTION 1: Remove containers by name pattern (recommended)
docker ps -aq --filter "name=dbrift" | xargs -r docker rm -f

# OPTION 2: If you prefix DB containers with postgres_
docker ps -aq --filter "name=postgres_" | xargs -r docker rm -f

# OPTION 3: If you want to be aggressive (DEV ONLY)
# docker container prune -f

echo "🧼 Docker containers cleaned"

# ---------------- VOLUMES (optional) ----------------
echo "🗑 Cleaning unused Docker volumes..."
docker volume prune -f

echo "✅ Cleanup done"

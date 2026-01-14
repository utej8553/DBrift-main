#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"
mkdir -p "$PID_DIR"

echo "🚀 Starting DBRift demo..."

# ---------- Backend ----------
echo "🔧 Starting Spring Boot backend..."
cd "$ROOT_DIR/backend"
mvn spring-boot:run > "$PID_DIR/backend.log" 2>&1 &
echo $! > "$PID_DIR/backend.pid"

# ---------- Frontend ----------
echo "🎨 Starting React frontend..."
cd "$ROOT_DIR/Frontend"

if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

npm run dev > "$PID_DIR/frontend.log" 2>&1 &
echo $! > "$PID_DIR/frontend.pid"

echo ""
echo "✅ Backend running on http://localhost:8080"
echo "✅ Frontend running on http://localhost:5173"
echo "Logs: $PID_DIR"

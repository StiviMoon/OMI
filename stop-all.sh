#!/bin/bash

# Script para detener todos los servicios de OMI

echo "🛑 Deteniendo proyecto OMI..."

# Leer PIDs si existen
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✓ Backend detenido (PID: $BACKEND_PID)"
    fi
    rm .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✓ Frontend detenido (PID: $FRONTEND_PID)"
    fi
    rm .frontend.pid
fi

# Matar cualquier proceso de node en los puertos
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✅ Todos los servicios detenidos"


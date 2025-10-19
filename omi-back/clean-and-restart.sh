#!/bin/bash

# Script para limpiar completamente el backend y reiniciarlo

echo "🧹 Limpiando backend de OMI..."

# Matar procesos de node/nodemon/ts-node
echo "→ Matando procesos..."
pkill -f nodemon 2>/dev/null || true
pkill -f ts-node 2>/dev/null || true

# Limpiar cache de TypeScript y node
echo "→ Limpiando cache..."
rm -rf .ts-node 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Limpiar y reinstalar dependencias (opcional, comentado por defecto)
# echo "→ Reinstalando dependencias..."
# rm -rf node_modules
# npm install

echo "✅ Limpieza completada!"
echo ""
echo "Ahora puedes ejecutar: npm run dev"


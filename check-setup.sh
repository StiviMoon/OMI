#!/bin/bash

# Script de diagnóstico para OMI Project

echo "======================================"
echo "   OMI Project - Diagnóstico"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar que los servidores estén corriendo
echo "1. Verificando servidores..."
echo ""

if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend (port 3000) está corriendo"
else
    echo -e "${RED}✗${NC} Frontend (port 3000) NO está corriendo"
    echo "   Ejecuta: cd omi-front && npm run dev"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend (port 3001) está corriendo"
else
    echo -e "${RED}✗${NC} Backend (port 3001) NO está corriendo"
    echo "   Ejecuta: cd omi-back && npm run dev"
fi

echo ""

# 2. Verificar archivos de configuración
echo "2. Verificando archivos de configuración..."
echo ""

if [ -f "omi-front/.env.local" ]; then
    echo -e "${GREEN}✓${NC} omi-front/.env.local existe"
    if grep -q "NEXT_PUBLIC_API_URL=http://localhost:3001" omi-front/.env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_API_URL está configurado correctamente"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_API_URL no está configurado correctamente"
    fi
else
    echo -e "${RED}✗${NC} omi-front/.env.local NO existe"
fi

if [ -f "omi-back/.env" ]; then
    echo -e "${GREEN}✓${NC} omi-back/.env existe"
    
    if grep -q "PEXELS_API_KEY=" omi-back/.env; then
        API_KEY=$(grep "PEXELS_API_KEY=" omi-back/.env | cut -d '=' -f2)
        if [ -n "$API_KEY" ] && [ "$API_KEY" != "your-pexels-api-key-here" ]; then
            echo -e "${GREEN}✓${NC} PEXELS_API_KEY está configurado"
        else
            echo -e "${RED}✗${NC} PEXELS_API_KEY no está configurado o es el valor por defecto"
        fi
    else
        echo -e "${RED}✗${NC} PEXELS_API_KEY no encontrado"
    fi
    
    if grep -q "CORS_ORIGIN=http://localhost:3000" omi-back/.env; then
        echo -e "${GREEN}✓${NC} CORS_ORIGIN está configurado correctamente"
    else
        echo -e "${YELLOW}⚠${NC} CORS_ORIGIN podría no estar configurado correctamente"
    fi
else
    echo -e "${RED}✗${NC} omi-back/.env NO existe"
fi

echo ""

# 3. Probar conexión al backend
echo "3. Probando conexión al backend..."
echo ""

if curl -s http://localhost:3001/api/videos/popular?page=1&per_page=1 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend responde correctamente"
    
    # Verificar CORS
    CORS_HEADER=$(curl -s -H "Origin: http://localhost:3000" -I http://localhost:3001/api/videos/popular?page=1&per_page=1 2>/dev/null | grep -i "access-control-allow-origin")
    if [ -n "$CORS_HEADER" ]; then
        echo -e "${GREEN}✓${NC} CORS configurado correctamente"
    else
        echo -e "${RED}✗${NC} CORS no está configurado correctamente"
    fi
else
    echo -e "${RED}✗${NC} Backend no responde"
fi

echo ""

# 4. Verificar MongoDB
echo "4. Verificando MongoDB..."
echo ""

if pgrep -x "mongod" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} MongoDB está corriendo"
else
    echo -e "${YELLOW}⚠${NC} MongoDB podría no estar corriendo"
    echo "   Esto es opcional si no usas autenticación todavía"
fi

echo ""
echo "======================================"
echo "   Diagnóstico Completo"
echo "======================================"
echo ""
echo "Si todos los checks están en verde (✓),"
echo "reinicia el frontend y limpia el caché del navegador."
echo ""


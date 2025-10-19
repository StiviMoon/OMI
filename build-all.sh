#!/bin/bash

# Script para compilar todo el proyecto OMI (Backend + Frontend)

set -e # Detener si hay errores

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║          BUILD COMPLETO DEL PROYECTO OMI                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

START_TIME=$(date +%s)

# ==================== BACKEND ====================
echo -e "${CYAN}╔═══ PARTE 1: BACKEND ═══╗${NC}"
echo ""

cd omi-back

echo -e "${BLUE}→ Limpiando archivos anteriores...${NC}"
npm run clean 2>/dev/null || true

echo -e "${BLUE}→ Compilando TypeScript...${NC}"
npm run build

echo -e "${GREEN}✓ Backend compilado exitosamente${NC}"
echo -e "${BLUE}  Archivos en: omi-back/dist/${NC}"
echo ""

cd ..

# ==================== FRONTEND ====================
echo -e "${CYAN}╔═══ PARTE 2: FRONTEND ═══╗${NC}"
echo ""

cd omi-front

echo -e "${BLUE}→ Compilando Next.js...${NC}"
npm run build

echo -e "${GREEN}✓ Frontend compilado exitosamente${NC}"
echo -e "${BLUE}  Archivos en: omi-front/.next/${NC}"
echo ""

cd ..

# ==================== RESUMEN ====================
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}               ✓ BUILD COMPLETADO EXITOSAMENTE              ${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}⏱  Tiempo total: ${DURATION}s${NC}"
echo ""
echo -e "${GREEN}✓${NC} Backend: omi-back/dist/"
echo -e "${GREEN}✓${NC} Frontend: omi-front/.next/"
echo ""
echo -e "${CYAN}Para iniciar en producción:${NC}"
echo -e "${YELLOW}  Backend:${NC}  cd omi-back && npm start"
echo -e "${YELLOW}  Frontend:${NC} cd omi-front && npm start"
echo ""


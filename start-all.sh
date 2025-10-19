#!/bin/bash

# Script para iniciar todo el proyecto OMI en modo producción

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║         INICIANDO PROYECTO OMI (PRODUCCIÓN)                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que los builds existan
if [ ! -d "omi-back/dist" ]; then
    echo -e "${YELLOW}⚠ Backend no está compilado. Ejecuta: ./build-all.sh${NC}"
    exit 1
fi

if [ ! -d "omi-front/.next" ]; then
    echo -e "${YELLOW}⚠ Frontend no está compilado. Ejecuta: ./build-all.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Builds encontrados${NC}"
echo ""

# Iniciar backend en background
echo -e "${CYAN}→ Iniciando Backend (puerto 3001)...${NC}"
cd omi-back
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
cd ..

# Esperar a que el backend arranque
sleep 3

# Iniciar frontend en background
echo -e "${CYAN}→ Iniciando Frontend (puerto 3000)...${NC}"
cd omi-front
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}              ✓ PROYECTO OMI INICIADO                       ${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✓${NC} Backend:  ${CYAN}http://localhost:3001${NC} (PID: $BACKEND_PID)"
echo -e "${GREEN}✓${NC} Frontend: ${CYAN}http://localhost:3000${NC} (PID: $FRONTEND_PID)"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "  Backend:  tail -f backend.log"
echo -e "  Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}Para detener:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Guardar PIDs en archivo
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo -e "${GREEN}PIDs guardados en .backend.pid y .frontend.pid${NC}"
echo ""


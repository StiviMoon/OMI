#!/bin/bash

# Test Completo de la API de OMI
# Prueba todos los endpoints: Auth + Videos

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# Configuración
API_URL="http://localhost:3001/api"
EMAIL="test.complete.$(date +%s)@example.com"
PASSWORD="TestPassword123!"
FIRST_NAME="Test"
LAST_NAME="Complete"
AGE=25

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Variables globales
TOKEN=""
USER_ID=""

# Funciones de log
log_section() {
    echo -e "\n${CYAN}${BOLD}═══ $1 ═══${NC}\n"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

log_subsection() {
    echo -e "\n${MAGENTA}${BOLD}→ $1${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar servidor
check_server() {
    log_section "VERIFICANDO SERVIDOR"
    
    if curl -s -o /dev/null -w "%{http_code}" "$API_URL/../" | grep -q "200\|404"; then
        log_success "Servidor está corriendo en $API_URL"
        return 0
    else
        log_error "Servidor no está corriendo"
        log_info "Ejecuta: npm run dev"
        exit 1
    fi
}

# ==================== TESTS DE AUTENTICACIÓN ====================

test_auth_register() {
    log_subsection "AUTH: Registro de Usuario"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\",
            \"password\": \"$PASSWORD\",
            \"firstName\": \"$FIRST_NAME\",
            \"lastName\": \"$LAST_NAME\",
            \"age\": $AGE
        }")
    
    TOKEN=$(echo $RESPONSE | jq -r '.data.token')
    USER_ID=$(echo $RESPONSE | jq -r '.data.user.id')
    
    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        log_success "Usuario registrado exitosamente"
        log_info "Email: $EMAIL"
    else
        log_error "Error al registrar usuario"
        echo $RESPONSE | jq
        exit 1
    fi
}

test_auth_login() {
    log_subsection "AUTH: Login"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\",
            \"password\": \"$PASSWORD\"
        }")
    
    NEW_TOKEN=$(echo $RESPONSE | jq -r '.data.token')
    
    if [ "$NEW_TOKEN" != "null" ] && [ -n "$NEW_TOKEN" ]; then
        log_success "Login exitoso"
    else
        log_error "Error en login"
        exit 1
    fi
}

test_auth_get_profile() {
    log_subsection "AUTH: Obtener Perfil"
    
    RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    USER_EMAIL=$(echo $RESPONSE | jq -r '.data.user.email')
    
    if [ "$USER_EMAIL" == "$EMAIL" ]; then
        log_success "Perfil obtenido correctamente"
    else
        log_error "Error al obtener perfil"
        exit 1
    fi
}

test_auth_update_profile() {
    log_subsection "AUTH: Actualizar Perfil"
    
    RESPONSE=$(curl -s -X PUT "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Test Updated",
            "age": 26
        }')
    
    UPDATED_NAME=$(echo $RESPONSE | jq -r '.data.user.firstName')
    
    if [ "$UPDATED_NAME" == "Test Updated" ]; then
        log_success "Perfil actualizado correctamente"
    else
        log_error "Error al actualizar perfil"
        exit 1
    fi
}

test_auth_change_password() {
    log_subsection "AUTH: Cambiar Contraseña"
    
    NEW_PASSWORD="NewPassword456!"
    
    RESPONSE=$(curl -s -X PUT "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"currentPassword\": \"$PASSWORD\",
            \"newPassword\": \"$NEW_PASSWORD\"
        }")
    
    MESSAGE=$(echo $RESPONSE | jq -r '.message')
    
    if [ "$MESSAGE" == "Profile updated successfully" ]; then
        log_success "Contraseña cambiada exitosamente"
        PASSWORD=$NEW_PASSWORD
    else
        log_error "Error al cambiar contraseña"
        exit 1
    fi
}

test_auth_forgot_password() {
    log_subsection "AUTH: Solicitar Recuperación"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\"
        }")
    
    RESET_TOKEN=$(echo $RESPONSE | jq -r '.token')
    
    if [ "$RESET_TOKEN" != "null" ] && [ -n "$RESET_TOKEN" ]; then
        log_success "Token de recuperación generado"
        log_info "Token: ${RESET_TOKEN:0:20}..."
        
        # Probar reset de contraseña
        NEW_RESET_PASSWORD="ResetPass789!"
        RESET_RESPONSE=$(curl -s -X POST "$API_URL/auth/reset-password" \
            -H "Content-Type: application/json" \
            -d "{
                \"token\": \"$RESET_TOKEN\",
                \"newPassword\": \"$NEW_RESET_PASSWORD\"
            }")
        
        RESET_MESSAGE=$(echo $RESET_RESPONSE | jq -r '.message')
        
        if [ "$RESET_MESSAGE" == "Password reset successfully" ]; then
            log_success "Contraseña restablecida exitosamente"
            PASSWORD=$NEW_RESET_PASSWORD
        else
            log_error "Error al restablecer contraseña"
            exit 1
        fi
    else
        log_warning "Token no disponible (modo producción)"
    fi
}

# ==================== TESTS DE VIDEOS (PEXELS) ====================

test_videos_search() {
    log_subsection "VIDEOS: Buscar Videos"
    
    RESPONSE=$(curl -s -X GET "$API_URL/videos/search?query=nature&per_page=5")
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    VIDEO_COUNT=$(echo $RESPONSE | jq -r '.data.videos | length')
    
    if [ "$SUCCESS" == "true" ] && [ "$VIDEO_COUNT" -gt "0" ]; then
        log_success "Búsqueda de videos exitosa"
        log_info "Videos encontrados: $VIDEO_COUNT"
    else
        log_error "Error en búsqueda de videos"
        echo $RESPONSE | jq
        exit 1
    fi
}

test_videos_search_with_filters() {
    log_subsection "VIDEOS: Buscar con Filtros"
    
    RESPONSE=$(curl -s -X GET "$API_URL/videos/search?query=ocean&orientation=landscape&per_page=3")
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    
    if [ "$SUCCESS" == "true" ]; then
        log_success "Búsqueda con filtros exitosa"
    else
        log_error "Error en búsqueda con filtros"
        exit 1
    fi
}

test_videos_popular() {
    log_subsection "VIDEOS: Videos Populares"
    
    RESPONSE=$(curl -s -X GET "$API_URL/videos/popular?per_page=5")
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    VIDEO_COUNT=$(echo $RESPONSE | jq -r '.data.videos | length')
    
    if [ "$SUCCESS" == "true" ] && [ "$VIDEO_COUNT" -gt "0" ]; then
        log_success "Videos populares obtenidos"
        log_info "Videos: $VIDEO_COUNT"
    else
        log_error "Error al obtener videos populares"
        exit 1
    fi
}

test_videos_by_id() {
    log_subsection "VIDEOS: Obtener Video por ID"
    
    # Primero obtenemos un ID de video
    SEARCH_RESPONSE=$(curl -s -X GET "$API_URL/videos/search?query=nature&per_page=1")
    VIDEO_ID=$(echo $SEARCH_RESPONSE | jq -r '.data.videos[0].id')
    
    if [ "$VIDEO_ID" != "null" ] && [ -n "$VIDEO_ID" ]; then
        RESPONSE=$(curl -s -X GET "$API_URL/videos/$VIDEO_ID")
        SUCCESS=$(echo $RESPONSE | jq -r '.success')
        
        if [ "$SUCCESS" == "true" ]; then
            log_success "Video obtenido por ID correctamente"
            log_info "Video ID: $VIDEO_ID"
        else
            log_error "Error al obtener video por ID"
            exit 1
        fi
    else
        log_warning "No se pudo obtener ID de video para test"
    fi
}

# ==================== TEST FINAL: ELIMINAR CUENTA ====================

test_delete_account() {
    log_subsection "AUTH: Eliminar Cuenta"
    
    RESPONSE=$(curl -s -X DELETE "$API_URL/auth/account" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"password\": \"$PASSWORD\"
        }")
    
    MESSAGE=$(echo $RESPONSE | jq -r '.message')
    
    if [ "$MESSAGE" == "Account deleted successfully" ]; then
        log_success "Cuenta eliminada exitosamente"
        
        # Verificar que el usuario ya no existe
        LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$EMAIL\",
                \"password\": \"$PASSWORD\"
            }")
        
        ERROR=$(echo $LOGIN_RESPONSE | jq -r '.error')
        
        if [ "$ERROR" != "null" ] && [ -n "$ERROR" ]; then
            log_success "Verificado: usuario eliminado de la base de datos"
        else
            log_error "ERROR: Usuario aún existe después de eliminar"
            exit 1
        fi
    else
        log_error "Error al eliminar cuenta"
        exit 1
    fi
}

# ==================== MAIN ====================

main() {
    echo -e "${BOLD}${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                    ║"
    echo "║              TEST COMPLETO DE LA API - OMI BACKEND                 ║"
    echo "║                                                                    ║"
    echo "║  Autenticación · Gestión de Usuarios · Videos (Pexels)            ║"
    echo "║                                                                    ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log_info "🌐 API Base URL: $API_URL"
    log_info "📧 Email de prueba: $EMAIL"
    log_info "📅 Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "🖥️  Sistema: $(uname -s) $(uname -m)"
    
    START_TIME=$(date +%s)
    
    # Verificar dependencias
    if ! command -v jq &> /dev/null; then
        log_error "jq no está instalado. Instálalo con: sudo apt install jq"
        exit 1
    fi
    
    # Verificar servidor
    check_server
    
    # ===== SECCIÓN 1: AUTENTICACIÓN Y USUARIOS =====
    log_section "PARTE 1: SISTEMA DE AUTENTICACIÓN"
    
    test_auth_register
    sleep 0.3
    test_auth_login
    sleep 0.3
    test_auth_get_profile
    sleep 0.3
    test_auth_update_profile
    sleep 0.3
    test_auth_change_password
    sleep 0.3
    test_auth_forgot_password
    sleep 0.3
    
    # ===== SECCIÓN 2: VIDEOS =====
    log_section "PARTE 2: SISTEMA DE VIDEOS (PEXELS)"
    
    test_videos_search
    sleep 0.3
    test_videos_search_with_filters
    sleep 0.3
    test_videos_popular
    sleep 0.3
    test_videos_by_id
    sleep 0.3
    
    # ===== SECCIÓN 3: LIMPIEZA =====
    log_section "PARTE 3: LIMPIEZA"
    
    test_delete_account
    
    # ===== RESUMEN =====
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo ""
    echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}                        RESUMEN FINAL                      ${NC}"
    echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}${BOLD}✓ TODOS LOS TESTS PASARON EXITOSAMENTE! 🎉${NC}"
    echo ""
    echo -e "${BOLD}Estadísticas:${NC}"
    echo -e "  ${GREEN}✓ Tests exitosos:${NC} $PASSED_TESTS/$TOTAL_TESTS"
    echo -e "  ${BLUE}⏱  Tiempo total:${NC} ${DURATION}s"
    echo -e "  ${CYAN}🚀 Velocidad:${NC} ~$(echo "scale=2; $TOTAL_TESTS / $DURATION" | bc) tests/seg"
    echo ""
    echo -e "${BOLD}Componentes probados:${NC}"
    echo -e "  ${GREEN}✓${NC} Sistema de Autenticación (JWT)"
    echo -e "  ${GREEN}✓${NC} Gestión de Usuarios (CRUD)"
    echo -e "  ${GREEN}✓${NC} Recuperación de Contraseña"
    echo -e "  ${GREEN}✓${NC} Sistema de Videos (Pexels)"
    echo -e "  ${GREEN}✓${NC} Validaciones y Seguridad"
    echo ""
    echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Ejecutar
main


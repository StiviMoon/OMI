#!/bin/bash

# Script de Test - Flujo Completo de Usuario
# Prueba: Registro → Login → Actualizar → Eliminar

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuración
API_URL="http://localhost:3001/api"
EMAIL="test.user.$(date +%s)@example.com"
PASSWORD="TestPassword123!"
FIRST_NAME="Test"
LAST_NAME="Usuario"
AGE=25

# Variables globales
TOKEN=""
USER_ID=""

# Funciones de log
log_section() {
    echo -e "\n${CYAN}${BOLD}═══ $1 ═══${NC}\n"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar que el servidor está corriendo
check_server() {
    log_section "VERIFICANDO SERVIDOR"
    
    if curl -s -o /dev/null -w "%{http_code}" "$API_URL/../" | grep -q "200\|404"; then
        log_success "Servidor está corriendo"
        return 0
    else
        log_error "Servidor no está corriendo en $API_URL"
        log_info "Ejecuta: npm run dev"
        exit 1
    fi
}

# Test 1: Registro
test_register() {
    log_section "TEST 1: REGISTRO DE USUARIO"
    
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
        log_info "Nombre: $FIRST_NAME $LAST_NAME"
        log_info "Edad: $AGE"
        log_info "Token: ${TOKEN:0:20}..."
    else
        log_error "Error al registrar usuario"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 2: Login
test_login() {
    log_section "TEST 2: LOGIN"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\",
            \"password\": \"$PASSWORD\"
        }")
    
    NEW_TOKEN=$(echo $RESPONSE | jq -r '.data.token')
    
    if [ "$NEW_TOKEN" != "null" ] && [ -n "$NEW_TOKEN" ]; then
        log_success "Login exitoso"
        log_info "Token recibido: ${NEW_TOKEN:0:20}..."
    else
        log_error "Error al hacer login"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 3: Obtener perfil
test_get_profile() {
    log_section "TEST 3: OBTENER PERFIL"
    
    RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    USER_EMAIL=$(echo $RESPONSE | jq -r '.data.user.email')
    
    if [ "$USER_EMAIL" != "null" ] && [ -n "$USER_EMAIL" ]; then
        log_success "Perfil obtenido exitosamente"
        log_info "Email: $(echo $RESPONSE | jq -r '.data.user.email')"
        log_info "Nombre: $(echo $RESPONSE | jq -r '.data.user.firstName') $(echo $RESPONSE | jq -r '.data.user.lastName')"
        log_info "Edad: $(echo $RESPONSE | jq -r '.data.user.age')"
    else
        log_error "Error al obtener perfil"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 4: Actualizar perfil
test_update_profile() {
    log_section "TEST 4: ACTUALIZAR PERFIL"
    
    RESPONSE=$(curl -s -X PUT "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Test Actualizado\",
            \"lastName\": \"Usuario Modificado\",
            \"age\": 26
        }")
    
    UPDATED_NAME=$(echo $RESPONSE | jq -r '.data.user.firstName')
    
    if [ "$UPDATED_NAME" == "Test Actualizado" ]; then
        log_success "Perfil actualizado exitosamente"
        log_info "Nuevo nombre: $(echo $RESPONSE | jq -r '.data.user.firstName') $(echo $RESPONSE | jq -r '.data.user.lastName')"
        log_info "Nueva edad: $(echo $RESPONSE | jq -r '.data.user.age')"
    else
        log_error "Error al actualizar perfil"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 5: Actualizar email
test_update_email() {
    log_section "TEST 5: ACTUALIZAR EMAIL"
    
    NEW_EMAIL="updated.$(date +%s)@example.com"
    
    RESPONSE=$(curl -s -X PUT "$API_URL/auth/profile" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$NEW_EMAIL\"
        }")
    
    UPDATED_EMAIL=$(echo $RESPONSE | jq -r '.data.user.email')
    
    if [ "$UPDATED_EMAIL" == "$NEW_EMAIL" ]; then
        log_success "Email actualizado exitosamente"
        log_info "Email anterior: $EMAIL"
        log_info "Email nuevo: $NEW_EMAIL"
        EMAIL=$NEW_EMAIL
    else
        log_error "Error al actualizar email"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 6: Cambiar contraseña
test_change_password() {
    log_section "TEST 6: CAMBIAR CONTRASEÑA"
    
    NEW_PASSWORD="NewTestPassword456!"
    
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
        
        # Verificar login con nueva contraseña
        log_info "Verificando login con nueva contraseña..."
        LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$EMAIL\",
                \"password\": \"$NEW_PASSWORD\"
            }")
        
        LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
        
        if [ "$LOGIN_TOKEN" != "null" ] && [ -n "$LOGIN_TOKEN" ]; then
            log_success "Login con nueva contraseña exitoso"
        else
            log_error "Error al hacer login con nueva contraseña"
            exit 1
        fi
    else
        log_error "Error al cambiar contraseña"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 7: Recuperar contraseña
test_forgot_password() {
    log_section "TEST 7: SOLICITAR RECUPERACIÓN DE CONTRASEÑA"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\"
        }")
    
    MESSAGE=$(echo $RESPONSE | jq -r '.message')
    RESET_TOKEN=$(echo $RESPONSE | jq -r '.token')
    
    if [ -n "$MESSAGE" ]; then
        log_success "Solicitud de recuperación enviada"
        log_info "$MESSAGE"
        
        if [ "$RESET_TOKEN" != "null" ] && [ -n "$RESET_TOKEN" ]; then
            log_info "Token de reset obtenido: ${RESET_TOKEN:0:20}..."
        else
            log_warning "Token no disponible (solo en desarrollo)"
        fi
    else
        log_error "Error al solicitar recuperación de contraseña"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 7.5: Resetear contraseña con token
test_reset_password() {
    log_section "TEST 7.5: RESTABLECER CONTRASEÑA CON TOKEN"
    
    # Obtener el token de recuperación primero
    FORGOT_RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\"
        }")
    
    RESET_TOKEN=$(echo $FORGOT_RESPONSE | jq -r '.token')
    
    if [ "$RESET_TOKEN" == "null" ] || [ -z "$RESET_TOKEN" ]; then
        log_warning "⚠ Test omitido: Token no disponible (requiere NODE_ENV=development)"
        return 0
    fi
    
    NEW_PASSWORD_RESET="ResetPassword789!"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/reset-password" \
        -H "Content-Type: application/json" \
        -d "{
            \"token\": \"$RESET_TOKEN\",
            \"newPassword\": \"$NEW_PASSWORD_RESET\"
        }")
    
    MESSAGE=$(echo $RESPONSE | jq -r '.message')
    
    if [ "$MESSAGE" == "Password reset successfully" ]; then
        log_success "Contraseña restablecida exitosamente"
        
        # Verificar login con la nueva contraseña
        log_info "Verificando login con contraseña restablecida..."
        LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$EMAIL\",
                \"password\": \"$NEW_PASSWORD_RESET\"
            }")
        
        LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
        
        if [ "$LOGIN_TOKEN" != "null" ] && [ -n "$LOGIN_TOKEN" ]; then
            log_success "Login con contraseña restablecida exitoso"
            # Actualizar la contraseña global para el test de eliminación
            PASSWORD=$NEW_PASSWORD_RESET
        else
            log_error "Error al hacer login con contraseña restablecida"
            exit 1
        fi
    else
        log_error "Error al restablecer contraseña"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Test 8: Eliminar cuenta
test_delete_account() {
    log_section "TEST 8: ELIMINAR CUENTA"
    
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
        log_info "Verificando que el usuario ya no existe..."
        LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$EMAIL\",
                \"password\": \"$PASSWORD\"
            }")
        
        ERROR=$(echo $LOGIN_RESPONSE | jq -r '.error')
        
        if [ "$ERROR" != "null" ] && [ -n "$ERROR" ]; then
            log_success "Verificación exitosa: el usuario ya no existe"
        else
            log_error "ERROR: El usuario aún existe después de eliminarlo"
            exit 1
        fi
    else
        log_error "Error al eliminar cuenta"
        echo $RESPONSE | jq
        exit 1
    fi
}

# Función principal
main() {
    echo -e "${BOLD}${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║          TESTS DE FLUJO COMPLETO DE USUARIO               ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log_info "API Base URL: $API_URL"
    log_info "Email de prueba: $EMAIL"
    log_info "Fecha: $(date)"
    
    START_TIME=$(date +%s)
    
    # Verificar dependencias
    if ! command -v jq &> /dev/null; then
        log_error "jq no está instalado. Por favor instálalo: sudo apt install jq"
        exit 1
    fi
    
    # Ejecutar tests
    check_server
    test_register
    sleep 0.5
    test_login
    sleep 0.5
    test_get_profile
    sleep 0.5
    test_update_profile
    sleep 0.5
    test_update_email
    sleep 0.5
    test_change_password
    sleep 0.5
    test_forgot_password
    sleep 0.5
    test_reset_password
    sleep 0.5
    test_delete_account
    
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    log_section "RESUMEN"
    log_success "Todos los tests pasaron exitosamente! 🎉"
    log_info "Tiempo total: ${DURATION}s"
    log_info "Tests ejecutados: 9/9"
    
    echo -e "\n${GREEN}${BOLD}✓ TODOS LOS TESTS COMPLETADOS${NC}\n"
}

# Ejecutar
main


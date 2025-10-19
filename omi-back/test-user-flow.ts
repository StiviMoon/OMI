/**
 * Script de Test - Flujo Completo de Usuario
 * 
 * Este script prueba todo el ciclo de vida de un usuario:
 * 1. Registro
 * 2. Login
 * 3. Obtener perfil
 * 4. Actualizar perfil (nombre, apellido, edad)
 * 5. Cambiar email
 * 6. Cambiar contraseña
 * 7. Solicitar recuperación de contraseña
 * 8. Eliminar cuenta
 */

import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  section: (msg: string) => console.log(`\n${colors.cyan}${colors.bright}═══ ${msg} ═══${colors.reset}\n`),
};

// Datos de prueba
const testUser = {
  email: `test.user.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'Usuario',
  age: 25,
};

let authToken = '';

// Helper para manejar errores
const handleError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error: string; message: string }>;
    log.error(`${context}: ${axiosError.response?.data?.error || axiosError.message}`);
  } else {
    log.error(`${context}: ${error}`);
  }
  throw error;
};

// Helper para hacer requests autenticados
const authenticatedRequest = (token: string) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Tests
async function testRegister() {
  log.section('TEST 1: REGISTRO DE USUARIO');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: testUser.email,
      password: testUser.password,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      age: testUser.age,
    });

    authToken = response.data.data.token;

    log.success('Usuario registrado exitosamente');
    log.info(`Email: ${testUser.email}`);
    log.info(`Nombre: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
    log.info(`Edad: ${response.data.data.user.age}`);
    log.info(`Token recibido: ${authToken.substring(0, 20)}...`);

    return response.data.data;
  } catch (error) {
    handleError(error, 'Error al registrar usuario');
  }
}

async function testLogin() {
  log.section('TEST 2: LOGIN');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    const newToken = response.data.data.token;

    log.success('Login exitoso');
    log.info(`Token recibido: ${newToken.substring(0, 20)}...`);
    log.info(`Usuario ID: ${response.data.data.user.id}`);

    return response.data.data;
  } catch (error) {
    handleError(error, 'Error al hacer login');
  }
}

async function testGetProfile() {
  log.section('TEST 3: OBTENER PERFIL');

  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/profile`,
      authenticatedRequest(authToken)
    );

    log.success('Perfil obtenido exitosamente');
    log.info(`Email: ${response.data.data.user.email}`);
    log.info(`Nombre completo: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
    log.info(`Edad: ${response.data.data.user.age}`);

    return response.data.data.user;
  } catch (error) {
    handleError(error, 'Error al obtener perfil');
  }
}

async function testUpdateProfile() {
  log.section('TEST 4: ACTUALIZAR PERFIL (Nombre y Edad)');

  const updatedData = {
    firstName: 'Test Actualizado',
    lastName: 'Usuario Modificado',
    age: 26,
  };

  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/profile`,
      updatedData,
      authenticatedRequest(authToken)
    );

    log.success('Perfil actualizado exitosamente');
    log.info(`Nuevo nombre: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
    log.info(`Nueva edad: ${response.data.data.user.age}`);

    return response.data.data.user;
  } catch (error) {
    handleError(error, 'Error al actualizar perfil');
  }
}

async function testUpdateEmail() {
  log.section('TEST 5: ACTUALIZAR EMAIL');

  const newEmail = `updated.${Date.now()}@example.com`;

  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/profile`,
      { email: newEmail },
      authenticatedRequest(authToken)
    );

    log.success('Email actualizado exitosamente');
    log.info(`Email anterior: ${testUser.email}`);
    log.info(`Email nuevo: ${newEmail}`);

    // Actualizar el email en testUser para futuras referencias
    testUser.email = newEmail;

    return response.data.data.user;
  } catch (error) {
    handleError(error, 'Error al actualizar email');
  }
}

async function testChangePassword() {
  log.section('TEST 6: CAMBIAR CONTRASEÑA');

  const newPassword = 'NewTestPassword456!';

  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/profile`,
      {
        currentPassword: testUser.password,
        newPassword: newPassword,
      },
      authenticatedRequest(authToken)
    );

    log.success('Contraseña cambiada exitosamente');
    log.info('Contraseña anterior: ********');
    log.info('Contraseña nueva: ********');

    // Actualizar la contraseña para futuras referencias
    testUser.password = newPassword;

    // Verificar que el login funciona con la nueva contraseña
    log.info('Verificando login con nueva contraseña...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: newPassword,
    });

    log.success('Login con nueva contraseña exitoso');

    return response.data.data.user;
  } catch (error) {
    handleError(error, 'Error al cambiar contraseña');
  }
}

async function testForgotPassword() {
  log.section('TEST 7: SOLICITAR RECUPERACIÓN DE CONTRASEÑA');

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email: testUser.email,
    });

    log.success('Solicitud de recuperación enviada');
    log.info(response.data.message);
    log.warning('Revisa tu email para obtener el token de reset');
    log.warning('(En desarrollo, revisa los logs del servidor)');

    return response.data;
  } catch (error) {
    handleError(error, 'Error al solicitar recuperación de contraseña');
  }
}

async function testDeleteAccount() {
  log.section('TEST 8: ELIMINAR CUENTA');

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/auth/account`,
      {
        ...authenticatedRequest(authToken),
        data: { password: testUser.password },
      }
    );

    log.success('Cuenta eliminada exitosamente');
    log.info(response.data.message);

    // Verificar que el usuario ya no existe intentando hacer login
    log.info('Verificando que el usuario ya no existe...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });
      log.error('ERROR: El usuario aún existe después de eliminarlo');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        log.success('Verificación exitosa: el usuario ya no existe');
      } else {
        throw error;
      }
    }

    return response.data;
  } catch (error) {
    handleError(error, 'Error al eliminar cuenta');
  }
}

// Función principal
async function runTests() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║          TESTS DE FLUJO COMPLETO DE USUARIO               ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  log.info(`API Base URL: ${API_BASE_URL}`);
  log.info(`Email de prueba: ${testUser.email}`);
  log.info(`Fecha: ${new Date().toLocaleString()}`);

  const startTime = Date.now();

  try {
    // Ejecutar todos los tests en secuencia
    await testRegister();
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa

    await testLogin();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testGetProfile();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testUpdateProfile();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testUpdateEmail();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testChangePassword();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testForgotPassword();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testDeleteAccount();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log.section('RESUMEN');
    log.success(`Todos los tests pasaron exitosamente! 🎉`);
    log.info(`Tiempo total: ${duration}s`);
    log.info(`Tests ejecutados: 8/8`);

    console.log(`\n${colors.green}${colors.bright}✓ TODOS LOS TESTS COMPLETADOS${colors.reset}\n`);

  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log.section('RESUMEN');
    log.error(`Los tests fallaron después de ${duration}s`);
    log.error('Revisa los errores anteriores para más detalles');

    console.log(`\n${colors.red}${colors.bright}✗ TESTS FALLIDOS${colors.reset}\n`);
    process.exit(1);
  }
}

// Ejecutar tests
runTests().catch((error) => {
  log.error('Error fatal en la ejecución de tests');
  console.error(error);
  process.exit(1);
});


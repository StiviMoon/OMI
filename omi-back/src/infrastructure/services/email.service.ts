import { Resend } from 'resend';
import { config } from '../../config';

export interface IEmailService {
  sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string
  ): Promise<void>;
}

export class EmailService implements IEmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.email.apiKey);
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string
  ): Promise<void> {
    const resetUrl = `${config.email.resetPasswordUrl}?token=${resetToken}`;
    const isDevelopment = config.nodeEnv === 'development';
    
    // Detectar si estamos usando el email de onboarding de Resend
    const isUsingResendOnboarding = config.email.fromEmail === 'onboarding@resend.dev';
    
    // Si usamos onboarding@resend.dev, SIEMPRE enviamos al DEV_EMAIL (producción o desarrollo)
    // porque Resend solo permite enviar a emails verificados sin dominio propio
    const emailTo = isUsingResendOnboarding ? config.email.devEmail : email;
    
    const emailSubject = isUsingResendOnboarding 
      ? `${isDevelopment ? '[DEV]' : '[PROD]'} Recuperar Contraseña - Usuario: ${email}`
      : 'Recuperación de Contraseña - OMI';

    // Log para debugging (en desarrollo Y en producción si usamos onboarding)
    if (isDevelopment || isUsingResendOnboarding) {
      const mode = isDevelopment ? 'Development' : 'Production (Resend Onboarding)';
      console.log(`\n🔐 PASSWORD RESET REQUEST (${mode})`);
      console.log('─'.repeat(60));
      console.log(`📧 Usuario original: ${email}`);
      console.log(`📨 Email enviado a: ${emailTo} (tu correo verificado)`);
      console.log(`👤 Nombre: ${firstName}`);
      console.log(`🔑 Token: ${resetToken}`);
      console.log(`🔗 URL: ${resetUrl}`);
      console.log('─'.repeat(60) + '\n');
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: `${config.email.fromName} <${config.email.fromEmail}>`,
        to: [emailTo],
        subject: emailSubject,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content {
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 16px 0;
                font-size: 16px;
              }
              .button-container {
                text-align: center;
                margin: 30px 0;
              }
              .button {
                display: inline-block;
                padding: 14px 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s;
              }
              .button:hover {
                transform: translateY(-2px);
              }
              .link-box {
                word-break: break-all;
                background-color: #f8f9fa;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                font-size: 14px;
                color: #6c757d;
                margin: 20px 0;
              }
              .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                padding: 30px;
                background-color: #f8f9fa;
                font-size: 14px;
                color: #6c757d;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                ${isUsingResendOnboarding ? `
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin-bottom: 24px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 14px; color: #856404;">
                    <strong>${isDevelopment ? '🔧 MODO DESARROLLO' : '⚙️ MODO PRODUCCIÓN (RESEND ONBOARDING)'}</strong><br>
                    <small>Solicitud para el usuario: <strong>${email}</strong></small>
                  </p>
                </div>
                ` : ''}
                <p>Hola <strong>${firstName}</strong>,</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de ${isUsingResendOnboarding ? `la cuenta <strong>${email}</strong>` : 'tu cuenta'} en OMI.</p>
                <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
                <div class="button-container">
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </div>
                <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                <div class="link-box">
                  ${resetUrl}
                </div>
                <div class="warning">
                  <strong>⏰ Este enlace expirará en 1 hora.</strong>
                </div>
                <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu cuenta permanecerá protegida.</p>
                <p style="margin-top: 30px;">
                  Saludos,<br>
                  <strong>El equipo de OMI</strong>
                </p>
              </div>
              <div class="footer">
                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                <p style="margin-top: 8px; color: #adb5bd;">© ${new Date().getFullYear()} OMI. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
${isUsingResendOnboarding ? `═══ ${isDevelopment ? 'MODO DESARROLLO' : 'MODO PRODUCCIÓN (RESEND ONBOARDING)'} ═══\nSolicitud para el usuario: ${email}\n\n` : ''}Hola ${firstName},

Hemos recibido una solicitud para restablecer la contraseña de ${isUsingResendOnboarding ? `la cuenta ${email}` : 'tu cuenta'} en OMI.

Para restablecer tu contraseña, visita el siguiente enlace:
${resetUrl}

Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.

Saludos,
El equipo de OMI
        `,
      });

      if (error) {
        console.error('⚠️  Error sending email (Resend):', error);
        throw new Error('Failed to send password reset email');
      }

      console.log(`✅ Password reset email sent to: ${emailTo}${emailTo !== email ? ` (original: ${email})` : ''}`);
    } catch (error) {
      console.error('⚠️  Error sending email (exception):', error);
      throw new Error('Failed to send password reset email');
    }
  }
}


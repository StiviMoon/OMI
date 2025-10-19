import crypto from 'crypto';
import { IUserRepository } from '../repositories/user.repository';
import { IEmailService } from '../../infrastructure/services/email.service';
import { config } from '../../config';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(email: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // For security reasons, don't reveal if user exists
      return {
        message: 'If the email exists, a reset link has been sent',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save token to user (expires in 1 hour)
    const updatedUser = user.setResetPasswordToken(hashedToken, 3600000);
    await this.userRepository.update(updatedUser);

    // Send email with reset token
    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.firstName
    );

    // En desarrollo, devolvemos el token para facilitar testing
    const response: { message: string; token?: string } = {
      message: 'If the email exists, a reset link has been sent',
    };
    
    if (config.nodeEnv === 'development') {
      response.token = resetToken;
    }
    
    return response;
  }
}


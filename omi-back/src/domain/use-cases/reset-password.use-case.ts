import crypto from 'crypto';
import { IUserRepository } from '../repositories/user.repository';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(token: string, newPassword: string) {
    // Hash the token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by reset token
    const user = await this.userRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Update password (user.update() will hash it automatically)
    const updatedUser = await user.update({ password: newPassword });
    
    // Clear reset token
    const finalUser = updatedUser.clearResetPasswordToken();
    await this.userRepository.update(finalUser);

    return {
      message: 'Password reset successfully',
    };
  }
}


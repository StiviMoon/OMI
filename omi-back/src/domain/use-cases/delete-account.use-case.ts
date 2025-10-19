import { IUserRepository } from '../repositories/user.repository';

export class DeleteAccountUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, password: string) {
    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Delete user
    await this.userRepository.delete(userId);

    return {
      message: 'Account deleted successfully',
    };
  }
}


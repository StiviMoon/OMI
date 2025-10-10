import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';
import { config } from '../../config';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials user not found');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials password not valid');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret
    );

    return {
      user: user.toJSON(),
      token,
    };
  }
}

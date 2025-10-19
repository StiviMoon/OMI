import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';
import { config } from '../../config';

/**
 * Use case responsible for authenticating a user.
 * 
 * This class handles the process of verifying user credentials
 * and generating a valid JWT token for authenticated sessions.
 */
export class LoginUseCase {
  /**
   * Creates an instance of the LoginUseCase.
   * 
   * @param {IUserRepository} userRepository - The user repository interface used to access user data.
   */
  constructor(private userRepository: IUserRepository) {}

  /**
   * Executes the login process by validating credentials and generating a JWT token.
   * 
   * @async
   * @param {string} email - The email address of the user attempting to log in.
   * @param {string} password - The plain text password provided by the user.
   * @returns {Promise<{ user: object, token: string }>} A promise that resolves with the authenticated user's data and JWT token.
   * 
   * @throws {Error} If the email does not exist or the password is invalid.
   * 
   * @example
   * const loginUseCase = new LoginUseCase(userRepository);
   * const result = await loginUseCase.execute('test@example.com', 'password123');
   * console.log(result.token);
   */
  async execute(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials: user not found');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials: password not valid');
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

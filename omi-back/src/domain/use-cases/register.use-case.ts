import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';
import { config } from '../../config';

/**
 * Use case responsible for registering a new user.
 * 
 * This class handles the process of verifying if a user already exists,
 * creating a new user entity, saving it in the repository, and generating
 * a JWT token for authentication.
 */
export class RegisterUseCase {
  /**
   * Creates an instance of the RegisterUseCase.
   * 
   * @param {IUserRepository} userRepository - The repository interface used to handle user persistence.
   */
  constructor(private userRepository: IUserRepository) {}

  /**
   * Executes the user registration process.
   * 
   * This method ensures that the provided email is not already in use,
   * creates a new user with a securely hashed password, persists it,
   * and returns the newly created user's data along with a JWT token.
   * 
   * @async
   * @param {string} email - The email address of the new user.
   * @param {string} password - The plain text password of the new user.
   * @returns {Promise<{ user: object, token: string }>} A promise resolving to an object containing the user's JSON representation and an authentication token.
   * 
   * @throws {Error} If the user already exists.
   * 
   * @example
   * const registerUseCase = new RegisterUseCase(userRepository);
   * const result = await registerUseCase.execute('test@example.com', 'password123');
   * console.log(result.user, result.token);
   */
  async execute(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create(email, password);
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      config.jwt.secret
    );

    return {
      user: savedUser.toJSON(),
      token,
    };
  }
}


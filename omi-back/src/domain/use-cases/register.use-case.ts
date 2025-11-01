import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';
import { config } from '../../config';

/**
 * Use case for user registration
 * 
 * Handles the business logic for creating a new user account:
 * - Validates age (must be between 13 and 120)
 * - Checks if user already exists (by email)
 * - Creates new user entity with hashed password
 * - Generates JWT token for immediate authentication
 * 
 * This use case follows Clean Architecture principles by:
 * - Being framework-independent
 * - Using repository abstraction for data access
 * - Containing pure business logic
 * - Being easily testable with mocks
 * 
 * @class RegisterUseCase
 * 
 * @example
 * ```typescript
 * const userRepository = new MongoUserRepository();
 * const registerUseCase = new RegisterUseCase(userRepository);
 * 
 * const result = await registerUseCase.execute(
 *   'user@example.com',
 *   'password123',
 *   'Juan',
 *   'Pérez',
 *   25
 * );
 * 
 * console.log(result.token); // JWT token
 * console.log(result.user); // User data
 * ```
 */
export class RegisterUseCase {
  /**
   * Creates an instance of RegisterUseCase
   * 
   * @param {IUserRepository} userRepository - Repository for user data persistence
   */
  constructor(private userRepository: IUserRepository) {}

  /**
   * Executes the user registration use case
   * 
   * This method performs the following steps:
   * 1. Validates user age (13-120 years)
   * 2. Checks if email already exists
   * 3. Creates user entity with hashed password
   * 4. Saves user to repository
   * 5. Generates JWT token
   * 6. Returns user data and token
   * 
   * @method execute
   * @async
   * @param {string} email - User's email address (must be unique)
   * @param {string} password - Plain text password (will be hashed with bcrypt)
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {number} age - User's age (must be between 13 and 120)
   * @returns {Promise<{user: UserJSON, token: string}>} Object containing user data and JWT token
   * @throws {Error} If age is not between 13 and 120
   * @throws {Error} If user with email already exists
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await registerUseCase.execute(
   *     'newuser@example.com',
   *     'SecurePassword123!',
   *     'María',
   *     'González',
   *     28
   *   );
   *   
   *   // User is now registered and can use the token for authentication
   *   console.log('User registered:', result.user.email);
   *   console.log('Token:', result.token);
   * } catch (error) {
   *   if (error.message === 'Age must be between 13 and 120') {
   *     // Handle age validation error
   *   } else if (error.message === 'User already exists') {
   *     // Handle duplicate email error
   *   }
   * }
   * ```
   */
  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ) {
    // Validate age
    if (age < 13 || age > 120) {
      throw new Error('Age must be between 13 and 120');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create(email, password, firstName, lastName, age);
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      String(config.jwt.secret),
      { expiresIn: '24h' }
    );

    return {
      user: savedUser.toJSON(),
      token,
    };
  }
}

import { User } from '../entities/user.entity';

/**
 * Interface that defines the contract for User repository operations.
 * 
 * This abstraction allows different implementations (e.g., MongoDB, SQL)
 * without coupling the domain layer to specific database logic.
 */
export interface IUserRepository {
  /**
   * Finds a user by their email address.
   * 
   * @async
   * @param {string} email - The email of the user to look for.
   * @returns {Promise<User|null>} A promise that resolves to the user if found, otherwise null.
   * 
   * @example
   * const user = await userRepository.findByEmail('test@example.com');
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique identifier.
   * 
   * @async
   * @param {string} id - The unique ID of the user.
   * @returns {Promise<User|null>} A promise that resolves to the user if found, otherwise null.
   * 
   * @example
   * const user = await userRepository.findById('12345');
   */
  findById(id: string): Promise<User | null>;

  /**
   * Persists a user entity to the database.
   * 
   * @async
   * @param {User} user - The user entity to save.
   * @returns {Promise<User>} A promise that resolves to the saved user.
   * 
   * @example
   * const savedUser = await userRepository.save(user);
   */
  save(user: User): Promise<User>;

  /**
   * Checks whether a user with the given email already exists.
   * 
   * @async
   * @param {string} email - The email address to verify.
   * @returns {Promise<boolean>} True if a user exists with that email, otherwise false.
   * 
   * @example
   * const exists = await userRepository.existsByEmail('test@example.com');
   */
  existsByEmail(email: string): Promise<boolean>;
}


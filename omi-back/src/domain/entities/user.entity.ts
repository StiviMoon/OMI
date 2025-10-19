import bcrypt from 'bcryptjs';

/**
 * Represents a user entity in the system.
 * 
 * This class encapsulates user-related data and behaviors, including
 * secure password hashing and validation.
 */
export class User {
  /**
   * Creates an instance of a User entity.
   * 
   * @param {string} id - The unique identifier of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The hashed password of the user.
   * @param {Date} createdAt - The date when the user was created.
   * @param {Date} updatedAt - The date when the user was last updated.
   */
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Factory method that creates a new User instance with a hashed password.
   * 
   * @async
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plain text password.
   * @returns {Promise<User>} A promise that resolves to a new User instance.
   * 
   * @example
   * const newUser = await User.create('test@example.com', 'password123');
   */
  public static async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    return new User(
      '', // Will be set by the repository
      email.toLowerCase().trim(),
      hashedPassword,
      now,
      now
    );
  }

  /**
   * Validates whether a given password matches the user's stored hashed password.
   * 
   * @async
   * @param {string} password - The plain text password to validate.
   * @returns {Promise<boolean>} True if the password matches, otherwise false.
   * 
   * @example
   * const isValid = await user.validatePassword('password123');
   */
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Returns a JSON representation of the user entity,
   * excluding sensitive information such as the password.
   * 
   * @returns {{ id: string, email: string, createdAt: Date, updatedAt: Date }} A safe JSON object.
   * 
   * @example
   * const json = user.toJSON();
   */
  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

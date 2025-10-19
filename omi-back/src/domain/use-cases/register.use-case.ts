import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';
import { config } from '../../config';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

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

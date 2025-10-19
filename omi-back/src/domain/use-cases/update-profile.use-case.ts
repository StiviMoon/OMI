import { IUserRepository } from '../repositories/user.repository';
import { UpdateUserData } from '../entities/user.entity';

export class UpdateProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    data: UpdateUserData,
    currentPassword?: string
  ) {
    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If updating password, verify current password
    if (data.password && currentPassword) {
      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    } else if (data.password && !currentPassword) {
      throw new Error('Current password is required to update password');
    }

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.existsByEmail(data.email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    // Validate age if provided
    if (data.age !== undefined && (data.age < 13 || data.age > 120)) {
      throw new Error('Age must be between 13 and 120');
    }

    // Update user
    const updatedUser = await user.update(data);
    const savedUser = await this.userRepository.update(updatedUser);

    return {
      user: savedUser.toJSON(),
    };
  }
}


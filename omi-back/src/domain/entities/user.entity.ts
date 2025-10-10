import bcrypt from 'bcryptjs';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

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

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

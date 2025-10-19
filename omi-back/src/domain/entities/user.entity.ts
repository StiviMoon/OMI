import bcrypt from 'bcryptjs';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  password?: string;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly age: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly resetPasswordToken?: string,
    public readonly resetPasswordExpires?: Date
  ) {}

  public static async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();
    
    return new User(
      '', // Will be set by the repository
      email.toLowerCase().trim(),
      hashedPassword,
      firstName.trim(),
      lastName.trim(),
      age,
      now,
      now
    );
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public async update(data: UpdateUserData): Promise<User> {
    const updatedPassword = data.password 
      ? await bcrypt.hash(data.password, 12) 
      : this.password;

    return new User(
      this.id,
      data.email ? data.email.toLowerCase().trim() : this.email,
      updatedPassword,
      data.firstName ?? this.firstName,
      data.lastName ?? this.lastName,
      data.age ?? this.age,
      this.createdAt,
      new Date(),
      this.resetPasswordToken,
      this.resetPasswordExpires
    );
  }

  public setResetPasswordToken(token: string, expiresIn: number = 3600000): User {
    const expiresAt = new Date(Date.now() + expiresIn); // Default: 1 hour
    
    return new User(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.age,
      this.createdAt,
      new Date(),
      token,
      expiresAt
    );
  }

  public clearResetPasswordToken(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.age,
      this.createdAt,
      new Date(),
      undefined,
      undefined
    );
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

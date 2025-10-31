export class Comment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly videoLink: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly userFirstName?: string,
    public readonly userLastName?: string,
    public readonly userEmail?: string
  ) {}

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      videoLink: this.videoLink,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      user: {
        firstName: this.userFirstName,
        lastName: this.userLastName,
        email: this.userEmail,
      },
    };
  }
}


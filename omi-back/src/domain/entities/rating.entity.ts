export class Rating {
    constructor(
      public readonly id: string,
      public readonly userId: string,
      public readonly videoLink: string,
      public readonly score: number, // 1-5 stars
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
      public readonly userFirstName?: string,
      public readonly userLastName?: string,
      public readonly userEmail?: string
    ) {
      // Validate score is between 1 and 5
      if (score < 1 || score > 5) {
        throw new Error('Rating score must be between 1 and 5');
      }
    }
  
    toJSON() {
      return {
        id: this.id,
        userId: this.userId,
        videoLink: this.videoLink,
        score: this.score,
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
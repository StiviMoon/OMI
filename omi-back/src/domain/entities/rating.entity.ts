export class Rating {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly pexelsId: string,
    public readonly score: number,
    public readonly comment: string,
    public readonly createdAt: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      pexelsId: this.pexelsId,
      score: this.score,
      comment: this.comment,
      createdAt: this.createdAt,
    };
  }
}

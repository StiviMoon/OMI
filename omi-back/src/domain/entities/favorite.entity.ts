export class Favorite {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly pexelsId: string,
    public readonly mediaType: 'photo' | 'video',
    public readonly createdAt: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      pexelsId: this.pexelsId,
      mediaType: this.mediaType,
      createdAt: this.createdAt,
    };
  }
}

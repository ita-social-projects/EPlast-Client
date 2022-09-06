export default class EventFeedback {
  id: number;
  text: string;
  rating: number;
  authorName: string;
  authorAvatarUrl: string;
  authorUserId: string;

  constructor() {
    this.id = 0;
    this.text = "";
    this.rating = 0;
    this.authorName = "";
    this.authorAvatarUrl = "";
    this.authorUserId = "";
  }
}

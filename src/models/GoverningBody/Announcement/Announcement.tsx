export type Announcement = {
  id: number;
  text: string;
  title: string;
  date: Date;
  firstName: string;
  lastName: string;
  userId: string;
  profileImage: string;
  images?: string[];
  imagesPresent?: boolean;
  isPined: boolean;
};

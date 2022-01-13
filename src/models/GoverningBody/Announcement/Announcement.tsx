export type Announcement = {
    id: number;
    text: string;
    date: Date;
    firstName: string;
    lastName: string;
    userId: string;
    profileImage: string;
    strippedString: string;
    images?: string;
}